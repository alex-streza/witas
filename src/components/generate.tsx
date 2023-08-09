"use client";

import { ArrowLeft, Brain, Info } from "@phosphor-icons/react";
import { useIntervalEffect, useLocalStorageValue } from "@react-hookz/web";
import { useCompletion } from "ai/react";
import { motion, useAnimate } from "framer-motion";
import type { MJMessage } from "midjourney";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { compressImage, fileToBase64, urltoFile } from "~/utils/images";
import { Imagine } from "~/utils/midjourney";
import { CircleButton } from "./circle-button";
import { ImageSplitter } from "./image-splitter";
import { Spinner } from "./spinner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Step = "TOKENS" | "PROMPT" | "LOADING" | "DONE";

const positions = [
  {
    x: 0,
    y: 0,
    corner: "top-left",
  },
  {
    x: 0,
    y: "-332px",
    corner: "top-right",
  },
  {
    x: "-332px",
    y: "-332px",
    corner: "bottom-right",
  },
  {
    x: "-332px",
    y: 0,
    corner: "bottom-left",
  },
];

const Result = ({
  prompt,
  images,
  image,
  progress = "0%",
  setStep,
}: {
  prompt: string;
  images: string[];
  setStep: (step: Step) => void;
  image?: string;
  progress?: string;
}) => {
  const positionRef = useRef(0);

  const [scope, animate] = useAnimate();
  const [splitImages, setSplitImages] = useState(false);

  useIntervalEffect(() => {
    if (image) {
      const enterAnimation = async () => {
        await animate("h1,.loading-grid,.info-container", {
          opacity: 0,
          display: "none",
        });
        await animate(".generated-image", {
          opacity: 1,
        });
        await animate(".img-container", {
          width: "100vw",
          height: "100vh",
          border: "none",
        });
        await animate(".download-container", {
          opacity: "1",
        });
        await animate(".info", {
          opacity: "0",
        });
        await animate(scope.current, {
          justifyContent: "start",
          alignItems: "start",
        });
        setSplitImages(true);
      };
      void enterAnimation();
    } else {
      positionRef.current =
        positionRef.current === positions.length ? 0 : positionRef.current + 1;

      const position = positions[positionRef.current];

      void animate(
        ".grid",
        {
          x: position?.x,
          y: position?.y,
        },
        {
          duration: 1.5,
          type: "tween",
        }
      );
    }
  }, 1500);

  return (
    <motion.div
      ref={scope}
      className="flex h-full flex-col items-center justify-between"
    >
      {splitImages && image && <ImageSplitter imageUrl={image} />}
      <motion.h1 className="relative mt-16 p-1.5 font-serif text-2xl">
        <motion.span
          className="absolute -left-1 top-0 -z-10 h-full bg-zinc-500 bg-opacity-40"
          animate={{
            width: progress,
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        ></motion.span>
        Generating #xxx
      </motion.h1>
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div className="img-container relative mb-3 aspect-square w-60 overflow-hidden border border-zinc-200">
          <motion.img
            className="generated-image absolute inset-0 aspect-square w-[576px] opacity-0"
            src={image}
          />
          <motion.div
            className="loading-grid absolute inset-0 grid w-[576px] grid-cols-3"
            initial={{ x: 0, y: 0 }}
          >
            {images.slice(0, 9).map((image) => (
              <img
                key={image}
                src={image}
                alt="Input"
                className="aspect-square w-48"
              />
            ))}
          </motion.div>
        </motion.div>
        <p className="text-center text-sm text-zinc-300">{prompt}</p>
      </div>
      <div className="info-container mt-auto flex max-w-[200px] items-start gap-2 text-xs text-zinc-400">
        <Info size={24} />
        <span>
          Using Midjourney, generation may take up to a minute so be patient
        </span>
      </div>
      <motion.div className="download-container z-20 mt-[calc(100vw)] flex w-full flex-col gap-5 opacity-0">
        {/* <motion.h1 className="font-serif text-2xl">DOWNLOAD STICKERS</motion.h1> */}
        {/* <div className="flex gap-5">
          <Button variant="secondary" className="w-full">
            <Download />
            Download all
          </Button>
          <Button className="w-full">
            <Share />
            Share
          </Button>
        </div> */}
        <div className="mb-5 flex flex-col gap-3">
          <Label htmlFor="prompt" className="font-serif text-xl">
            Prompt
          </Label>
          <Textarea
            name="prompt"
            placeholder="A sticker of a cute Superman character, chibi-style anime character — ar 1:1 — niji 5 — s 180 --q 2 --s 750"
            value={prompt}
            readOnly
            disabled
          />
        </div>
        <div className="flex w-full justify-end">
          <div className="rotate-12">
            <CircleButton text="GO" onClick={() => setStep("PROMPT")} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export interface Message {
  text: string;
  img: string;
  msgID?: string;
  msgHash?: string;
  content?: string;
  hasTag: boolean;
  progress?: string;
}

export const Generate = ({ images }: { images: string[] }) => {
  const { set: setEnv, value: env } = useLocalStorageValue<{
    channelId: string;
    serverId: string;
    authorization: string;
    replicateToken: string;
    subject?: string;
  }>("env", {
    defaultValue: {
      channelId: "",
      serverId: "",
      authorization: "",
      replicateToken: "",
      subject: "",
    },
  });

  const [loadingSettings, setLoadingSettings] = useState(true);

  const [step, setStep] = useState<Step>("DONE");
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptData, setPromptData] = useState<{
    prompt: string;
    subject: string;
  }>({
    prompt: "",
    subject: "",
  });
  const [completedImage, setCompletedImage] = useState<string>();

  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      body: {
        styles: "cartoon, surrealist",
      },
    });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setEnv({
      channelId: env?.channelId ?? "",
      serverId: env?.serverId ?? "",
      authorization: env?.authorization ?? "",
      replicateToken: env?.replicateToken ?? "",
      [name as keyof typeof env]: value,
    });
  };

  const uploadImage = async (image: string) => {
    fetch("/api/upload", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        prompt,
        image: await fileToBase64(
          await compressImage(await urltoFile(image, "image.png", "image/png"))
        ),
      }),
    }).catch((err) => console.error(err));
  };

  const handleMessageSend = async () => {
    setStep("LOADING");

    const newMessage: Message = {
      text: promptData.prompt.trim(),
      hasTag: false,
      progress: "waiting start",
      img: "",
    };

    if (newMessage.text) {
      const oldMessages = messages;
      setMessages([...oldMessages, newMessage]);

      await Imagine(
        JSON.stringify({ prompt: newMessage.text }),
        (data: MJMessage) => {
          newMessage.img = data.uri;
          if (data.id) {
            newMessage.hasTag = true;
          }
          newMessage.msgHash = data.hash;
          newMessage.msgID = data.id;
          newMessage.progress = data.progress;
          newMessage.content = data.content;
          setMessages([...oldMessages, newMessage]);

          if (data.progress === "done") {
            setCompletedImage(data.uri);
            void uploadImage(data.uri);
            setStep("DONE");
          } else {
            setStep("LOADING");
          }
        }
      );
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (env?.authorization && env?.channelId && env?.serverId) {
        setStep("PROMPT");
      }
      setLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      if (step === "LOADING") setCompletedImage(images[0]);
    }, 2000);

    return () => clearTimeout(id);
  }, [images, step]);

  useEffect(() => {
    if (completion !== "")
      setPromptData((prev) => ({
        ...prev,
        prompt: completion + " --ar 1:1 --niji 5 --q 2 --s 750",
      }));
  }, [completion]);

  return (
    <>
      {loadingSettings && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <Spinner className="h-12 w-12" />
        </div>
      )}
      {!loadingSettings && step === "TOKENS" && (
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
              <Label htmlFor="serverId">Server ID</Label>
              <Input
                name="serverId"
                placeholder="Paste server_id"
                value={env?.serverId}
                onChange={handleChange}
              />
            </div>
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
              <Label htmlFor="authorization">Authorization</Label>
              <Input
                name="authorization"
                placeholder="Paste authorization"
                value={env?.authorization}
                onChange={handleChange}
                type="password"
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
          <div className="flex w-full justify-end">
            <div className="rotate-12">
              <CircleButton text="GO" onClick={() => setStep("PROMPT")} />
            </div>
          </div>
        </>
      )}
      {!loadingSettings && step === "PROMPT" && (
        <>
          <button onClick={() => setStep("TOKENS")}>
            <ArrowLeft size={32} />
          </button>
          <h1 className="font-serif text-2xl">Generate prompt</h1>
          <p className="mt-3 text-sm text-zinc-300">
            Generate the perfect prompt for your Rad sticker design or customize
            it to your prompt engineering likings.
          </p>
          <div className="mt-5">
            <form className="mb-5 flex flex-col gap-3" onSubmit={handleSubmit}>
              <Label htmlFor="subject" className="font-serif text-xl">
                Sticker Subject
              </Label>
              <Input
                name="subject"
                placeholder="arry potte'"
                onChange={handleInputChange}
                value={input}
              />
              <Button
                variant="secondary"
                type="submit"
                disabled={input === "" || isLoading}
              >
                {isLoading && <Spinner />}
                {!isLoading && (
                  <>
                    <Brain />
                    <span>Generate prompt</span>
                  </>
                )}
              </Button>
            </form>
            <div className="mb-5 flex flex-col gap-3">
              <Label htmlFor="prompt" className="font-serif text-xl">
                Prompt
              </Label>
              <Textarea
                name="prompt"
                placeholder="A sticker of a cute Superman character, chibi-style anime character — ar 1:1 — niji 5 — s 180 --q 2 --s 750"
                value={promptData.prompt}
                onChange={(event) =>
                  setPromptData({
                    ...promptData,
                    prompt: event.target.value,
                  })
                }
              />
              <span className="flex items-center gap-1 text-sm text-zinc-500">
                <Info />
                <span>
                  {!env?.authorization || !env?.channelId || !env?.serverId
                    ? "Defaulting to DALL-E-2"
                    : "Using Midjourney"}
                </span>
              </span>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="rotate-12">
              <CircleButton
                text="GO"
                onClick={handleMessageSend}
                disabled={promptData.prompt === ""}
              />
            </div>
          </div>
        </>
      )}
      {((!loadingSettings && step === "LOADING") || step === "DONE") && (
        <Result
          prompt={promptData.prompt}
          images={images}
          image={completedImage}
          setStep={setStep}
          progress={messages[messages.length - 1]?.progress}
        />
      )}
    </>
  );
};
