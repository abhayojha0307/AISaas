import { Hash ,Sparkles} from 'lucide-react'
import React from 'react'

const BlogTitle = () => {
  const blogCategory = ["General", "Technology", "Business", "Health", "Education", "Travel", "Food", "Lifestyle"];
    const [selectedCategory, setSelectedCategory] = React.useState("General");
    const [inputTopic, setInputTopic] = React.useState("");
    const onSubmitHandler = async (e) => {
      e.preventDefault();
      // Handle form submission logic here
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
          className="w-full flex justify-center items-center gap-2 
          bg-gradient-to-r from-[#C341FC] to-[#8E37EB] text-white px-4 py-2 mt-6 
          text-sm rounded-md cursor-pointer"
        >
          <Hash className="w-5" />
          Generate Title
        </button>
      </form>
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
       border-gray-200 min-h-98">
       <div className="flex items-center gap-4">
          <Hash className="w-6 h-5 text-[#8E37EB]"/>
          <h1 className="text-xl font-semibold">Generated Title</h1> 
       </div>
       <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
          <Hash className="w-9 h-9 text-[#8E37EB]"/>
          <p>Enter the Category and click "Generate Title" to get started</p>
          </div>
       </div>
       </div>
    </div>
  )
}

export default BlogTitle
