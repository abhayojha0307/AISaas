import { Hash, Sparkles } from "lucide-react";
import React,{useState} from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const BlogTitle = () => {
  const blogCategory = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Education",
    "Travel",
    "Food",
    "Lifestyle",
  ];
  const [selectedCategory, setSelectedCategory] = React.useState("General");
  const [inputTopic, setInputTopic] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate a  blog title for the keyword ${inputTopic} in the category ${selectedCategory}`;
      const token = await getToken();

      const { data } = await axios.post(
        `http://localhost:3000/api/ai/generate-blog-title`,
        {
          prompt,
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
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h2 className="text-xl font-semibold">Ai Title Generator</h2>
        </div>
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          type="text"
          placeholder="Enter the topic of your article"
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 "
          onChange={(e) => setInputTopic(e.target.value)}
          value={inputTopic}
          required
        />
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-4 flex gap-4 flex-wrap sm:max-w-9/11">
          {blogCategory.map((item, index) => (
            <span
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${
                  selectedCategory === item
                    ? "bg-purple-50 text-purple-700"
                    : "border-gray-300 text-gray-600"
                }`}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
          bg-gradient-to-r from-[#C341FC] to-[#8E37EB] text-white px-4 py-2 mt-6 
          text-sm rounded-md cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
       border-gray-200 min-h-98"
      >
        <div className="flex items-center gap-4">
          <Hash className="w-6 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Title</h1>
        </div>
        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9 text-[#8E37EB]" />
              <p>
                Enter the Category and click "Generate Title" to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitle;
