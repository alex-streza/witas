"use client";

import { ArrowLeft, Copy } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env.mjs";
import { useColors } from "~/utils/use-colors";

export const StickerShowcase = ({
  id,
  prompt,
  colors: defaultColors,
}: {
  id: number;
  prompt: string;
  colors: {
    id: number;
    name: string | null;
    percentage: number | null;
    color: string;
  }[];
}) => {
  const [savedColors, setSavedColors] = useState(defaultColors.length > 0);

  const imageUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/raw/${id}.png`;
  const colors = useColors(imageUrl, savedColors);

  const handleCopy = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (colors.length > 0 && !savedColors) {
      setSavedColors(true);

      fetch("/api/colors", {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          colors: colors.map((col) => ({
            name: col.name ?? "",
            percentage: Math.floor(col.percentage ?? 0 * 100),
            color: col.color,
            stickerId: id,
          })),
        }),
      }).catch((err) => console.error(err));
    }
  }, [colors, savedColors]);

  return (
    <>
      <div className="absolute left-0 top-0 z-20 w-full bg-gradient-to-b from-zinc-900 to-transparent p-5">
        <Link href="/explore">
          <ArrowLeft size={32} />
        </Link>
        <motion.h1 className="font-serif text-2xl">STICKER #{id}</motion.h1>
      </div>
      <Image
        className="generated-image absolute left-0 top-0 aspect-square w-[576px]"
        src={imageUrl}
        alt=""
        width={512}
        height={512}
      />
      <div className="mt-[100vw] flex flex-wrap gap-3">
        {(colors ?? defaultColors)?.map((color) => (
          <button
            key={color.color}
            className="group grid h-6 w-6 place-content-center rounded"
            style={{
              backgroundColor: color.color,
            }}
            onClick={() => handleCopy(color.color)}
          >
            <Copy className="opacity-0 transition-all duration-200 group-hover:opacity-100" />
          </button>
        ))}
      </div>
      <div className="my-5 flex flex-col gap-3">
        <Label htmlFor="prompt" className="font-serif text-xl">
          Prompt
        </Label>
        <Textarea
          name="prompt"
          placeholder="A sticker of a cute Superman character, chibi-style anime character — ar 1:1 — niji 5 — s 180 --q 2 --s 750"
          value={prompt ?? ""}
          disabled
          readOnly
        />
      </div>
    </>
  );
};
