import { Edit, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

const WriteArticle = () => {
  const articleLength = [
    { label: "Short (500-800 words)", length: 800 },
    { label: "Medium (800-1200 words)", length: 1200 },
    { label: "Long (1200+ words)", length: 1600 },
  ];
  const [selectedLength, setSelectedLength] = React.useState(articleLength[0]);
  const [inputTopic, setInputTopic] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    try {
      setLoading(true);
      const prompt = `Write an article about ${inputTopic} in ${selectedLength.length}`;
      const token = await getToken();

      const { data } = await axios.post(
        `http://localhost:3000/api/ai/generate-article`,
        {
          prompt,
          length: selectedLength.length,
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
          <Sparkles className="w-6 text-[#4A7Aff]" />
          <h2 className="text-xl font-semibold">Article Configuration</h2>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          type="text"
          placeholder="Enter the topic of your article"
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 "
          onChange={(e) => setInputTopic(e.target.value)}
          value={inputTopic}
          required
        />
        <p className="mt-4 text-sm font-medium">Article Length</p>
        <div className="mt-4 flex gap-4 flex-wrap sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              key={index}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${
                  selectedLength.label === item.label
                    ? "bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600"
                }`}
              onClick={() => setSelectedLength(item)}
            >
              {item.label}
            </span>
          ))}
        </div>
        <br />
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
          bg-gradient-to-r from-[#226BEF] to-[#65ADFF] text-white px-4 py-2 mt-6 
          text-sm rounded-md cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
       border-gray-200 min-h-98 max-h-[600px]"
      >
        <div className="flex items-center gap-4">
          <Edit className="w-6 h-5 text-[#4A7Aff]" />
          <h1 className="text-xl font-semibold">Generated Articles</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9 text-[#4A7Aff]" />
              <p>Enter the topic and click "Generate Article" to get started</p>
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

export default WriteArticle;
