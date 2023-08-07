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
      <div className="absolute -left-5 top-[20%] w-fit rotate-12 scale-50 md:top-80 md:scale-100">
        <Parallax offset={1.3}>
          <WigglySticker />
        </Parallax>
      </div>
      <div className="absolute -right-4 bottom-[10%] w-fit -rotate-12 scale-50 md:-bottom-12 md:left-60 md:scale-100">
        <Parallax offset={1}>
          <RawSticker image="/images/stickers/raw.png" />
        </Parallax>
      </div>
      <div className="absolute right-0 top-[24%] -z-10 w-fit -rotate-12 scale-50 md:-top-12 md:left-24 md:scale-100">
        <Parallax offset={1.7}>
          <RoundSticker image="/images/stickers/round.png" />
        </Parallax>
      </div>
      <div className="absolute -left-20 bottom-[20%] w-fit rotate-12 scale-50 md:bottom-80 md:left-[540px] md:scale-100">
        <Parallax offset={0.6}>
          <SpikySticker text="completely AI generated" />
        </Parallax>
      </div>
    </>
  );
};
