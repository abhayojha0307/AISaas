import { Eraser, Hash, Sparkles } from "lucide-react";
import React from "react";

const RemoveBackground = () => {
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
          <Sparkles className="w-6 text-[#FF4938]" />
          <h2 className="text-xl font-semibold">Background Removal</h2>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setInputTopic(e.target.files[0])}
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">Supports JPG, PNG and other image format</p>
        <button
          className="w-full flex justify-center items-center gap-2 
              bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 
              text-sm rounded-md cursor-pointer"
        >
          <Eraser className="w-5" />
          Remove Background
        </button>
      </form>
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
           border-gray-200 min-h-98"
      >
        <div className="flex items-center gap-4">
          <Eraser className="w-6 h-5 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Eraser className="w-9 h-9 text-[#FF4938]" />
            <p>Upload the image and click "Remove Background" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
