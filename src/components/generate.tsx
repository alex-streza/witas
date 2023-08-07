"use client";

import { useLocalStorageValue } from "@react-hookz/web";
import { ChangeEvent, useState } from "react";
import { CircleButton } from "./circle-button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Step = "TOKENS" | "PROMPT" | "LOADING" | "DONE";
export const Generate = () => {
  const { set: setEnv, value: env } = useLocalStorageValue<{
    channelId: string;
    serverId: string;
    authorization: string;
    replicateToken: string;
  }>("env", {
    defaultValue: {
      channelId: "",
      serverId: "",
      authorization: "",
      replicateToken: "",
    },
  });

  const [step, setStep] = useState<Step>("TOKENS");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setEnv({
      channelId: env?.channelId ?? "",
      serverId: env?.serverId ?? "",
      authorization: env?.authorization ?? "",
      replicateToken: env?.replicateToken ?? "",
      [name as keyof typeof env]: value,
    });
  };

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
          <div className="mt-5">
            <div className="mb-5 flex flex-col gap-3">
              <Label htmlFor="channelId">Channel ID</Label>
              <Input
                name="channelId"
                placeholder="Paste channel_id"
                value={env?.channelId}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5 flex flex-col gap-3">
              <Label htmlFor="serverId">Server ID</Label>
              <Input
                name="serverId"
                placeholder="Paste server_id"
                value={env?.serverId}
                onChange={handleChange}
              />
            </div>
            <div className="mb-5 flex flex-col gap-3">
              <Label htmlFor="authorization">Authorization</Label>
              <Input
                name="authorization"
                placeholder="Paste authorization"
                value={env?.authorization}
                onChange={handleChange}
              />
            </div>
          </div>
          <h2 className="mt-5 font-serif text-xl">REPLICATE API</h2>
          <p className="mt-2 text-sm text-zinc-300">authorization</p>
          <div className="mt-5">
            <div className="mb-5 flex flex-col gap-3">
              <Label htmlFor="replicateToken">API Token</Label>
              <Input
                name="replicateToken"
                placeholder="Paste API Token"
                value={env?.replicateToken}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="absolute -bottom-12 right-1/2 translate-x-1/2 rotate-12">
            <CircleButton text="GO" onClick={() => setStep("PROMPT")} />
          </div>
        </>
      )}
    </>
  );
};
