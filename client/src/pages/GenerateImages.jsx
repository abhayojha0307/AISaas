import { Hash, Image, Sparkles } from "lucide-react";
import React,{useState} from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const GenerateImages = () => {
  const imageCategory = [
    "Realistic",
    "Ghibli style",
    "Anime Style",
    "Cartoon Style",
    "Fantasy Style",
    "3D style",
    "Portrait Style",
  ];
  const [selectedCategory, setSelectedCategory] = React.useState("Realistic");
  const [inputTopic, setInputTopic] = React.useState("");
  const [publish, setPublish] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      setLoading(true);
      const prompt = `Generate an image of ${inputTopic} in the style ${selectedCategory}`;
      const token = await getToken();

      const { data } = await axios.post(
        `http://localhost:3000/api/ai/generate-image`,
        {
          prompt,
          publish,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(data.message);
    }
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="w-6 text-[#00AD25]" />
          <h2 className="text-xl font-semibold">Ai Image Generator</h2>
        </div>
        <p className="mt-6 text-sm font-medium">Describe your image</p>
        <textarea
          row={4}
          placeholder="Describe the image you want to generate..."
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 "
          onChange={(e) => setInputTopic(e.target.value)}
          value={inputTopic}
          required
        />
        <p className="mt-4 text-sm font-medium">Styles</p>
        <div className="mt-4 flex gap-4 flex-wrap sm:max-w-9/11">
          {imageCategory.map((item, index) => (
            <span
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${
                  selectedCategory === item
                    ? "bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-600"
                }`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="my-6 flex flex-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
          </label>
          <p className="text-sm">Make this image public</p>
        </div>
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
          bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 mt-6 
          text-sm rounded-md cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
       border-gray-200 min-h-98"
      >
        <div className="flex items-center gap-4">
          <Image className="w-6 h-5 text-[#00AD25]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Image className="w-9 h-9 text-[#00AD25]" />
            <p>Enter the style and click "Generate Image" to get started</p>
          </div>
        </div>
        ) :(
          <div className="mt-3 h-full">
            <img src={content} alt="image" className="w-full h-full" />
          </div>
        )}
        
      </div>
    </div>
  );
};

export default GenerateImages;
