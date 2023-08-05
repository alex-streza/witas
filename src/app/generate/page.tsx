"use client";

import { useCompletion } from "ai/react";

export default function SloganGenerator() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    body: {
      styles: "cartoon, surrealist",
    },
  });

  console.log("completion", completion);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          className="fixed left-5 top-20 mb-8 w-full rounded border border-gray-300 p-2 shadow-xl"
          value={input}
          placeholder="Enter the prompt main subject/character"
          onChange={handleInputChange}
        />
      </form>
      {completion && (
        <div className="my-6 whitespace-pre-wrap text-white">
          {completion} --ar 1:1 --v 5.2 --s 180 --q 2 --s 750
        </div>
      )}
    </>
  );
}
