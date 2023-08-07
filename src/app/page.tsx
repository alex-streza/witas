import Link from "next/link";
import { ShuffleText } from "~/components/animation/shuffle";
import { CircleButton } from "~/components/circle-button";
import { StickerScene } from "~/components/stickers";

export default function Page() {
  return (
    <>
      <div className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 px-5 text-white md:h-[600px] md:w-[978px]">
        <div className="relative grid h-full w-full place-content-center">
          <StickerScene />
          <h1 className="h-20 text-[80px] font-extrabold md:h-28 md:text-9xl md:text-[180px]">
            WITAS
          </h1>
          <ShuffleText
            className="w=full mt-3 max-w-[300px] text-xs font-medium text-zinc-400 md:w-[400px] md:max-w-full md:max-w-none md:text-2xl"
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
