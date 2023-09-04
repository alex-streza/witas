// "use client";

import Link from "next/link";
import { ShuffleText } from "~/components/animation/shuffle";
import { CircleButton } from "~/components/circle-button";
import { ClickStickers, StickerScene } from "~/components/stickers";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

export default function Page() {
  // useEffect(() => {
  //   mixpanel.track("Page View", {
  //     "Page Type": "Home Page",
  //   });
  // }, []);

  return (
    <>
      <ClickStickers />
      <div className="absolute left-1/2 top-1/2 h-full max-h-[340px] w-full -translate-x-1/2 -translate-y-1/2 px-5 text-white md:h-[600px] md:w-[978px]">
        <div className="full relative grid h-full w-full place-content-center overflow-visible">
          <StickerScene />
          <h1 className="h-20 text-[80px] font-extrabold md:h-32 md:text-9xl md:text-[180px]">
            <Link href="/generate">WITAS</Link>
          </h1>
          <ShuffleText
            className="mt-3 h-12 w-full max-w-[300px] text-xs font-medium text-zinc-400 md:mt-8 md:w-[400px] md:max-w-full md:max-w-none md:text-xl"
            text="Wait is that a sticker?"
          />
        </div>
      </div>
      {/* <Image
        src="/images/temp.png"
        alt="Picture of the author"
        className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
        width={978.6}
        height={631.29}
      /> */}
      <Link
        href="/generate"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 -rotate-12 md:hidden"
      >
        <CircleButton text="GO" />
      </Link>
    </>
  );
}
