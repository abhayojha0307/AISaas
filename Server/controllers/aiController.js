const OpenAI = require("openai");
const { sql } = require("../configs/db.js");
const { default: axios } = require("axios");
const { arrayBuffer } = require("stream/consumers");
const { v2 } = require("cloudinary");
const fs = require("fs");
const pdfParse = require("pdf-parse")

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    console.log("USER ID:", userId);

    const { prompt, length } = req.body;

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;
    console.log("CONTENT:", content.substring(0, 50));

    const result = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
      RETURNING *
    `;

    console.log("DB RESULT:", result);

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    console.log("USER ID:", userId);

    const { prompt } = req.body;

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = response.choices[0].message.content;
    const result = await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
      RETURNING *
    `;

    res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;

    const form = new FormData();
    form.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      form,
      {
        headers: {
          "x-api-key": process.env.CLIP_DROP_API_KEY,
        },
        responseType: "arraybuffer", // <-- important
      }
    );

    // Convert ArrayBuffer to base64 correctly
    const buffer = Buffer.from(data);
    const base64Image = `data:image/png;base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResult = await v2.uploader.upload(base64Image, {
      folder: "aisaas",
    });

    const secure_url = uploadResult.secure_url;

    // Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
      RETURNING *
    `;

    res.status(200).json({ success: true, content: secure_url });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image  = req.file;
    const form = new FormData();
    form.append("image_file", fs.createReadStream(image.path));

    // Upload to Cloudinary
    const uploadResult = await v2.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    const secure_url = uploadResult.secure_url;

    // Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from the image', ${secure_url}, 'image')
      RETURNING *
    `;

    res.status(200).json({ success: true, content: secure_url });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const { object } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, error: "Image not provided" });
    }

    if (!object) {
      return res.status(400).json({ success: false, error: "Object to remove is required" });
    }

    // 1️⃣ Upload Original Image
    const uploadResult = await v2.uploader.upload(image.path, {
      folder: "aisaas",
      resource_type: "image",
    });

    const public_id = uploadResult.public_id;

    // 2️⃣ Generate transformation URL with object removal
    const imageUrl = v2.url(`${public_id}.png`, {
      transformation: [
        {
          effect: `gen_remove:${object}`,   // <-- IMPORTANT CHANGE
        },
      ],
    });

    // 3️⃣ Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Remove ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.status(200).json({ success: true, content: imageUrl });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;

    if (!resume) {
      return res.json({
        success: false,
        message: "No resume uploaded",
      });
    }

    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume size is more than 5MB",
      });
    }

    const dataBuffer = fs.readFileSync(resume.path);

    // ✔ FIXED — Use pdfParse (NOT pdf, NOT .default)
    const pdfData = await pdfParse(dataBuffer);

    const prompt = `
      Review the following resume and provide:
      - Strengths
      - Weaknesses
      - Areas for improvement
      - ATS optimization tips
      
      Resume content:
      ${pdfData.text}
    `;

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${"Review the uploaded resume"}, ${content}, 'review-resume')
    `;

    res.status(200).json({ success: true, content });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



module.exports = { generateArticle, generateBlogTitle, generateImage, removeBackground,removeObject,reviewResume };
