import Link from "next/link";
import { env } from "~/env.mjs";
import { supabase } from "~/server/supabase/supabaseClient";

export default async function Page() {
  const { data } = await supabase().from("stickers").select("*").limit(1000);

  return (
    <>
      <h1 className="font-serif text-4xl">Explore</h1>
      <div className="mt-8 flex flex-wrap gap-5">
        {data?.map((sticker) => (
          <Link
            className="relative"
            href={`/explore/${sticker.id}`}
            key={sticker.id}
          >
            <span className="absolute left-0 top-0 w-full bg-gradient-to-b from-zinc-900 to-transparent p-2 font-serif">
              #{sticker.id}
            </span>
            <img
              className="h-40 w-40 rounded-lg md:h-[360px] md:w-[360px]"
              src={`${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/raw/${sticker.id}.png`}
              alt={sticker?.prompt ?? ""}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
