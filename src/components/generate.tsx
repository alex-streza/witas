"use client";

import {
  ArrowLeft,
  Brain,
  Info,
  SmileySad,
  SmileySticker,
  Warning,
} from "@phosphor-icons/react";
import {
  useIntervalEffect,
  useLocalStorageValue,
  useMediaQuery,
} from "@react-hookz/web";
import { useCompletion } from "ai/react";
import { motion, useAnimate } from "framer-motion";
import type { MJMessage } from "midjourney";
import Link from "next/link";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

type Step = "TOKENS" | "PROMPT" | "LOADING" | "DONE";

const Result = ({
  id,
  prompt,
  images,
  image,
  progress = "0%",
  setStep,
}: {
  id?: number;
  prompt: string;
  images: string[];
  setStep: (step: Step) => void;
  image?: string;
  progress?: string;
}) => {
  const positionRef = useRef(0);

  const [scope, animate] = useAnimate();
  const [splitImages, setSplitImages] = useState(false);

  const positions = [
    {
      x: 0,
      y: 0,
      corner: "top-left",
    },
    {
      x: 0,
      y: "-180px",
      corner: "top-right",
    },
    {
      x: "-180px",
      y: "-180px",
      corner: "bottom-right",
    },
    {
      x: "-180px",
      y: 0,
      corner: "bottom-left",
    },
  ];

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
        void animate(".info-container", {
          opacity: "0",
        });
        void animate(".prompt-text", {
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
      {splitImages && image && id && (
        <ImageSplitter imageUrl={image} stickerId={id} />
      )}
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
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-5 md:right-0 md:translate-x-0">
        <motion.div className="img-container relative mb-3 aspect-square w-full overflow-hidden border border-zinc-200">
          <motion.img
            className="generated-image absolute inset-0 aspect-square w-full opacity-0"
            src={image}
          />
          <motion.div
            className="loading-grid absolute inset-0 grid w-[512px] grid-cols-3"
            initial={{ x: 0, y: 0 }}
          >
            {images.map((image) => (
              <img
                key={image}
                src={image}
                alt="Input"
                className="aspect-square w-48"
              />
            ))}
          </motion.div>
        </motion.div>
        <p className="prompt-text text-center text-sm text-zinc-300">
          {prompt}
        </p>
      </div>
      <div className="info-container absolute bottom-12 left-1/2 flex w-[200px] -translate-x-1/2 items-start gap-2 text-xs text-zinc-400">
        <Info size={24} />
        <span>
          Using Midjourney, generation may take up to a minute so be patient
        </span>
      </div>
      <motion.div className="download-container z-20 mt-[calc(100vw)] flex w-full flex-col gap-5 opacity-0">
        <div className="mb-3 flex flex-col gap-3">
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
        <div className="relative flex w-full justify-end">
          <Button className="w-full" onClick={() => setStep("PROMPT")}>
            <SmileySticker />
            Generate again
          </Button>
        </div>
        <div className="mt-2 flex w-full max-w-[360px] items-start gap-2 text-xs text-zinc-400">
          <Info size={24} />
          <span>
            You&apos;ll get an e-mail with all optimized stickers (upscaled and
            with background removed) every ~10 minutes.
          </span>
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

type Version =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "5.1"
  | "5.2"
  | "niji 5"
  | "niji 4";

const versions: Version[] = ["5.2", "5.1", "5", "4", "niji 5", "niji 4"];

const styles = [
  "cartoon",
  "surrealist",
  "cyberpunk",
  "pastel",
  "watercolor",
  "modern",
  "abstract",
];

export const Generate = ({ images }: { images: string[] }) => {
  const { set: setEnv, value: env } = useLocalStorageValue<{
    channelId?: string;
    serverId?: string;
    authorization?: string;
    replicateToken?: string;
    subject?: string;
    count: number;
  }>("env", {
    defaultValue: {
      channelId: "",
      serverId: "",
      authorization: "",
      replicateToken: "",
      subject: "",
      count: 0,
    },
  });

  // const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [stickerId, setStickerId] = useState<number>();
  const isPhone = useMediaQuery("(max-width: 640px)");

  const [step, setStep] = useState<Step>("TOKENS");
  // const [step, setStep] = useState<Step>("LOADING");
  const { value: email, set: setEmail } = useLocalStorageValue<string>(
    "email",
    {
      defaultValue: "",
    }
  );

  const [version, setVersion] = useState<Version>("5.2");

  const [messages, setMessages] = useState<Message[]>([]);
  const [promptData, setPromptData] = useState<{
    prompt: string;
    subject: string;
  }>({
    prompt: "",
    subject: "",
  });
  const [completedImage, setCompletedImage] = useState<string>();
  // const [completedImage, setCompletedImage] = useState<string>(
  //   "https://cdn.discordapp.com/attachments/1087721443980230766/1137470431016792114/astre9_a_sticker_image_of_a_cute_couple_in_desertpunk_style_wit_c0072b57-dd05-4df4-ad0a-d662a45ee7c2.png"
  // );

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
      count: env?.count ?? 0,
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
        email,
        prompt: promptData.prompt,
        image: await fileToBase64(
          await compressImage(await urltoFile(image, "image.png", "image/png"))
        ),
      }),
    })
      .then((res) => res.json())
      .then((data: { id: number }) => {
        setStickerId(data?.id);
      })
      .catch((err) => console.error(err));
  };

  const handleMessageSend = async () => {
    setStep("LOADING");
    setEnv({
      ...env,
      count: (env?.count ?? 0) + 1,
    });

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
        JSON.stringify({
          prompt: newMessage.text,
          serverId: env?.serverId,
          channelId: env?.channelId,
          authorization: env?.authorization,
        }),
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
    if (step === "TOKENS" || step === "PROMPT") {
      setCompletedImage(undefined);
    }
  }, [step]);

  // useEffect(() => {
  //   const id = setTimeout(() => {
  //     if (step === "LOADING") setCompletedImage(images[0]);
  //   }, 2000);

  //   return () => clearTimeout(id);
  // }, [images, step]);

  useEffect(() => {
    if (completion !== "")
      setPromptData((prev) => ({
        ...prev,
        prompt: `${completion}, ${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          styles[Math.floor(Math.random() * styles.length)]
        } --ar 1:1 ${
          version.includes("niji") ? `--${version}` : `--v ${version}`
        } --q 2 --s 750`,
      }));
  }, [completion, version]);

  const canGenerate =
    (env?.authorization && env?.channelId && env?.serverId) || env?.count === 0;

  return (
    <>
      {loadingSettings && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <Spinner className="h-12 w-12" />
        </div>
      )}
      {!loadingSettings && step === "TOKENS" && (
        <>
          <div className="max-w-lg">
            <h1 className="font-serif text-2xl md:text-4xl">Enter tokens</h1>
            <p className="mt-3 text-sm text-zinc-300">
              You&apos;ll be asked to enter the following Midjourney related:{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-green">
                    server id and channel id
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[400px] font-sans text-sm">
                      How to get server and channel ids:
                      <br />
                      1. when you click on a channel in your server in the
                      browser
                      <br />
                      2. expect to have the following URL pattern:
                      <br />
                      <br />
                      <span className="italic">
                        https://discord.com/channels/server_id/channel_id
                      </span>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
              and{" "}
              <Link
                href="https://www.androidauthority.com/get-discord-token-3149920/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline underline"
              >
                discord token
              </Link>
              .
              <br />
              <br />
              If no tokens are entered you&apos;ll be able to test generate a
              single sticker.
            </p>
            <h2 className="mt-5 font-serif text-xl">MidjouRNEY STUFF</h2>
            <p className="mt-2 text-sm text-zinc-300">
              To get those values follow this guide (requires logging into
              Discord from browser)
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
            {/* <h2 className="mt-5 font-serif text-xl">REPLICATE API</h2>
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
          </div> */}
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
          <div className="max-w-xl">
            <button onClick={() => setStep("TOKENS")}>
              <ArrowLeft size={32} />
            </button>
            <h1 className="font-serif text-2xl md:text-4xl">Generate prompt</h1>
            <p className="mt-3 text-sm text-zinc-300">
              Generate the perfect prompt for your Rad sticker design or
              customize it to your prompt engineering likings.
            </p>
            <div className="mt-5">
              <form
                className="mb-5 flex flex-col gap-3"
                onSubmit={handleSubmit}
              >
                <Label htmlFor="email" className="font-serif text-xl">
                  Your e-mail
                </Label>
                <Input
                  name="email"
                  placeholder="E-mail to receive optimized stickers"
                  onChange={(ev) => setEmail(ev.target.value)}
                  value={email}
                />

                <div className="flex items-start gap-2 text-xs text-zinc-400">
                  <Info size={24} />
                  <span>
                    We need your e-mail to send you optimized stickers (upscaled
                    and with background removed){" "}
                  </span>
                </div>
                <Label htmlFor="subject" className="mt-3 font-serif text-xl">
                  stickers Subject
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
                  disabled={input === "" || isLoading || !canGenerate}
                >
                  {isLoading && <Spinner />}
                  {!isLoading && (
                    <>
                      <Brain />
                      <span>Generate prompt</span>
                    </>
                  )}
                </Button>
                <div className="flex flex-wrap gap-2">
                  {versions.map((v) => (
                    <Button
                      key={v}
                      variant={version === v ? "default" : "secondary"}
                      onClick={() => setVersion(v)}
                      type="button"
                    >
                      {v}
                    </Button>
                  ))}
                </div>
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
                  {canGenerate ? (
                    <>
                      <Info />
                      <span>
                        {!env?.authorization ||
                        !env?.channelId ||
                        !env?.serverId
                          ? "Test mode"
                          : "Using Midjourney"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Warning
                        className="flex-shrink-0 text-yellow-600"
                        size={20}
                      />
                      <span className="text-yellow-600">
                        Youv&apos;e already used your test generation, enter
                        your tokens on the previous step to continue.
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end">
            <div className="rotate-12">
              <CircleButton
                text="GENERATE"
                onClick={handleMessageSend}
                disabled={promptData.prompt === "" || !canGenerate}
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
          id={stickerId}
        />
      )}
      <div className="fixed inset-0 z-20 hidden h-screen w-screen place-content-center bg-zinc-900 md:grid">
        <div className="flex flex-col gap-3">
          <SmileySad size={48} />
          <h1 className="max-w-lg font-sans text-3xl">
            We are sorry but you must use your phone for generation.
            <br />
            <br />
            Desktop support is coming soon.
          </h1>
        </div>
      </div>
    </>
  );
};
