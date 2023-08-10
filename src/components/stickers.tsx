"use client";
import {
  RawSticker,
  RoundSticker,
  SpikySticker,
  WigglySticker,
} from "~/components/sticker";
import { Parallax } from "./animation/parallax";

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
