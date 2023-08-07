"use client";

import { useState } from "react";
import { CircleButton } from "./circle-button";

type Step = "TOKENS" | "PROMPT" | "LOADING" | "DONE";
export const Generate = () => {
  const [step, setStep] = useState<Step>("TOKENS");

  return (
    <>
      {step === "TOKENS" && (
        <>
          <h1 className="font-serif text-2xl">Enter tokens</h1>
          <p className="mt-3 text-sm text-zinc-300">
            You&apos;ll be asked to enter the following: Radjourney related:
            channel id, server id and discord token
            <br />
            Upscale/crop images: Replicate API Token
            <br />
            <br />
            If no tokens are entered the generations may be underwhelming since
            the images will be generated with DALL-e-2
          </p>
          <h2 className="mt-5 font-serif text-xl">RADJOURNEY STUFF</h2>
          <p className="mt-2 text-sm text-zinc-300">
            To get those values follow this guide (requires logging into Discord
            from browser)
          </p>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rotate-12">
            <CircleButton text="GO" onClick={() => setStep("PROMPT")} />
          </div>
        </>
      )}
    </>
  );
};
