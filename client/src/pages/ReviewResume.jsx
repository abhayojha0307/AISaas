import { FileText, Hash, Sparkles } from "lucide-react";
import React from "react";

const ReviewResume = () => {
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
          <Sparkles className="w-6 text-[#00DA83]" />
          <h2 className="text-xl font-semibold">Resume Review</h2>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          type="file"
          accept="application/pdf"
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setInputTopic(e.target.files[0])}
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">Supports pdf resume only</p>
        <button
          className="w-full flex justify-center items-center gap-2 
              bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 
              text-sm rounded-md cursor-pointer"
        >
          <FileText className="w-5" />
          Review Resume
        </button>
      </form>
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
           border-gray-200 min-h-98 max-h-[600px]"
      >
        <div className="flex items-center gap-4">
          <FileText className="w-6 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Resume</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <FileText className="w-9 h-9 text-[#00DA83]" />
            <p>Upload the resume and click "Review Resume" to get started</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewResume
