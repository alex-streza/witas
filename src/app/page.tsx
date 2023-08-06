import { acronym } from "~/utils/acronym";
import { StickerScene } from "~/components/stickers";
import Image from "next/image";

export default function Page() {
  return (
    <>
      {/* <StickerScene /> */}
      <div className="left-1/2 top-1/2 -z-10 hidden -translate-x-1/2 -translate-y-1/2 flex-col text-white md:flex">
        <h1 className="-mt-20 text-9xl font-extrabold md:text-[180px]">
          WITAS
        </h1>
        <span className="-mt-12 text-2xl font-medium">
          {acronym("WITAS")}
          {/* Wait is that a sticker? */}
        </span>
      </div>
      <Image
        src="/images/temp.png"
        alt="Picture of the author"
        className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 md:hidden"
        width={978.6}
        height={631.29}
      />
    </>
  );
}
