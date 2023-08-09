"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { env } from "~/env.mjs";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <>
      <div className="absolute left-0 top-0 z-10 w-full bg-gradient-to-b from-zinc-900 to-transparent p-5">
        <motion.h1 className="font-serif text-2xl">
          STICKER #{params.id}
        </motion.h1>
      </div>
      <Image
        className="generated-image absolute inset-0 -z-10 aspect-square w-[576px]"
        src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/stickers/${params.id}.png`}
        alt=""
        width={512}
        height={512}
      />
    </>
  );
}
