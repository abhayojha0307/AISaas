import { Eraser, Hash, Scissors, Sparkles } from "lucide-react";
import React from "react";

const RemoveObject = () => {
  const [inputTopic, setInputTopic] = React.useState("");
  const [object, setObject] = React.useState("");
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
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h2 className="text-xl font-semibold">Object Removal</h2>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setInputTopic(e.target.files[0])}
          required
        />
        <p className="mt-6 text-sm font-medium">Describe object name to be removed</p>
        <textarea
          type="text"
          accept="image/*"
          className="w-full mt-2 p-2 px-3 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setObject(e.target.value)}
          value={object}
          placeholder="e.g. watch or spoon. Only one object at a time."
          required
        />
        <button
          className="w-full flex justify-center items-center gap-2 
              bg-gradient-to-r from-[#417DF6] to-[#8E37Eb] text-white px-4 py-2 mt-6 
              text-sm rounded-md cursor-pointer"
        >
          <Scissors className="w-5" />
          Remove Background
        </button>
      </form>
      <div
        className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border
           border-gray-200 min-h-98"
      >
        <div className="flex items-center gap-4">
          <Scissors className="w-6 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-9 h-9 text-[#4A7AFF]" />
            <p>Upload the image and click "Remove Object" to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveObject;

