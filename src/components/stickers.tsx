"use client";
import {
  RawSticker,
  RoundSticker,
  SpikySticker,
  WigglySticker,
} from "~/components/sticker";
import { Parallax } from "./animation/parallax";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const StickerScene = () => {
  return (
    <>
      <div className="absolute -left-5 top-2 w-fit rotate-12 scale-50 md:bottom-0 md:top-auto md:scale-100">
        <Parallax offset={1.3}>
          <WigglySticker />
        </Parallax>
      </div>
      <div className="absolute -bottom-20 -right-12 w-fit -rotate-12 scale-50 md:right-12 md:scale-100">
        <Parallax offset={1}>
          <RawSticker image="/images/stickers/raw.png" />
        </Parallax>
      </div>
      <div className="absolute -top-4 left-auto right-0 -z-10 w-fit -rotate-12 scale-50 md:-top-24 md:left-0 md:scale-100">
        <Parallax offset={1.7}>
          <RoundSticker image="/images/stickers/round.png" />
        </Parallax>
      </div>
      <div className="absolute -bottom-4 -left-20 w-fit rotate-12 scale-50 md:-top-12 md:left-auto md:right-0 md:scale-100">
        <Parallax offset={0.6}>
          <SpikySticker text="completely AI generated" />
        </Parallax>
      </div>
    </>
  );
};

const baseUrl =
  "https://eiuckazvagocqjiisium.supabase.co/storage/v1/object/public/optimized";
const urls = [
  `${baseUrl}/40_v212.png`,
  `${baseUrl}/40_v7451.png`,
  `${baseUrl}/40_v6999.png`,
  `${baseUrl}/38.png`,
];

export const ClickStickers = () => {
  const [stickers, setStickers] = useState<
    {
      x: number;
      y: number;
      rotate: number;
      url: string;
      zIndex: number;
    }[]
  >([]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (stickers.length > 3)
        setStickers((prev) => [
          ...prev.slice(1),
          {
            x: e.clientX - 80,
            y: e.clientY - 80,
            url: urls[Math.floor(Math.random() * 4)] as string,
            rotate: Math.random() * 360,
            zIndex: prev[prev.length - 1].zIndex + 1,
          },
        ]);
      else
        setStickers((prev) => [
          ...prev,
          {
            x: e.clientX - 80,
            y: e.clientY - 80,
            url: urls[Math.floor(Math.random() * 4)] as string,
            rotate: Math.random() * 360,
            zIndex: (prev[prev.length - 1]?.zIndex || 0) + 1 || 1,
          },
        ]);
    };

    window.addEventListener("click", onClick);

    return () => window.removeEventListener("click", onClick);
  }, [stickers.length]);

  return (
    <>
      <AnimatePresence>
        {stickers.map(({ x, y, url, zIndex }, i) => (
          <motion.div
            key={`${x}-${y}`}
            className="fixed h-40 w-40 -translate-x-1/2 -translate-y-1/2 scale-0 transform rounded-full opacity-0 md:h-64 md:w-64"
            style={{ left: x, top: y, zIndex }}
            animate={{
              opacity: 1,
              scale: 1.1,
            }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Parallax>
              <img
                style={{
                  transform: `rotate(${stickers[i].rotate}deg)`,
                }}
                src={url}
                alt="sticker"
              />
            </Parallax>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};
