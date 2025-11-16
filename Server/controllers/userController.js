const { sql } = require("../configs/db.js");
const getUserCreation = async (req, res) => {
  try {
    const {userId}=req.auth()
    const creations=await sql `SELECT * FROM creations  WHERE user_id=${userId} ORDER BY created_at DESC`;
    res.json({success:true,creations})
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getPublishCreations = async (req, res) => {
  try {
    const creations=await sql `SELECT * FROM creations  WHERE publish=true ORDER BY created_at DESC`;
    res.json({success:true,creations})
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// const toggleLikeCreations = async (req, res) => {
//   try {
//     const {userId}=req.auth()
//     const {id}=req.body

//     // const {creation} =await sql `SELECT * FROM creations  WHERE id=${id}`
//     const [creation] = await sql`SELECT * FROM creations WHERE id=${id}`;

//     if(!creation){
//         return res.json({success:true,message:"Creation not found"})
//     }
//     const currentLikes=creation.likes;
//     const userIdStr=userId.toString();
//     let updatedLikes;
//     let message;
//     if(currentLikes.includes(userIdStr)){
//         updatedLikes=currentLikes.filter((user)=>user != userIdStr);
//         message="Creation Unlike"
//     }else{
//         updatedLikes=[...currentLikes,userIdStr],
//         message="Creation Like"
//     }

//     const formattedLike=updatedLikes.join(",")

//     await sql `UPDATE creations SET likes=${formattedLike}::[] where id=${id} `

//     res.json({success:true,message})
//   } catch (error) {
//     console.error("SERVER ERROR:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    // Fetch creation row
    const [creation] = await sql`SELECT * FROM creations WHERE id=${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    // Ensure likes is an array
    const currentLikes = creation.likes || [];
    const userIdStr = String(userId);

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((uid) => uid !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    // 🍀 FIX: store ARRAY properly (not string casting)
    await sql`
      UPDATE creations
      SET likes = ${updatedLikes}
      WHERE id = ${id}
    `;

    res.json({ success: true, message });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports={
    getUserCreation,
    getPublishCreations,
    toggleLikeCreations
}