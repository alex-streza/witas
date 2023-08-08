"use client";

import { useCompletion } from "ai/react";
import { ImageSplitter } from "~/components/image-splitter";
import { ImageColorAnalyzer } from "~/components/image-colors";
import { ImagineUI } from "~/components/imagine";

export default function Page() {
  const { completion, input, handleInputChange, handleSubmit } = useCompletion({
    body: {
      styles: "cartoon, surrealist",
    },
  });

  return (
    <>
      {/* <ImageSplitter imageUrl="https://cdn.discordapp.com/attachments/1087721443980230766/1137467746435735622/astre9_a_sticker_of_a_cute_harry_potter_character_cartoon-style_6037aa98-37ad-4c5a-b780-8ed817fba63f.png" /> */}
      {/* <ImageColorAnalyzer
        imageUrl="https://i.ibb.co/k59PsdQ/image-22.png"
        topColorsCount={10}
      /> */}
      <ImagineUI />
      {/* <form onSubmit={handleSubmit}>
        <input
          className="fixed left-5 top-20 mb-8 w-full rounded border border-gray-300 p-2 shadow-xl"
          placeholder="Enter the prompt main subject/character"
          onChange={handleInputChange}
          value={input}
        />
      </form>
      {completion && (
        <div className="my-6 whitespace-pre-wrap text-white">
          {completion} --ar 1:1 --v 5.2 --s 180 --q 2 --s 750
        </div>
      )} */}
    </>
  );
}
