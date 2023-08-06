"use client";
import { Flag } from "@phosphor-icons/react";
import {
  RawSticker,
  RoundSticker,
  SpikySticker,
  WigglySticker,
} from "~/components/sticker";

export const StickerScene = () => {
  return (
    <div>
      <WigglySticker className="absolute left-[20%] top-[48%] rotate-12" />
      <RawSticker
        image="/images/stickers/raw.png"
        className="absolute left-[32%] top-[54%] -rotate-12"
      />
      <RoundSticker
        image="/images/stickers/round.png"
        className="absolute left-[24%] top-[18%] -rotate-12"
      />
      <SpikySticker
        text="completely AI generated"
        className="absolute left-[64%] top-[8%] rotate-12"
      />
    </div>
  );
};
