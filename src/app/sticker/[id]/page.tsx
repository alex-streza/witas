import Link from "next/link";
import { CircleButton } from "~/components/circle-button";
import { StickerShowcase } from "~/components/sticker-showcase";
import { supabase } from "~/server/supabase/supabaseClient";

export default async function Page({ params }: { params: { id: string } }) {
  const { data: sticker } = await supabase()
    .from("stickers")
    .select("*,colors (*)")
    .eq("id", params.id)
    .single();

  return (
    <>
      {sticker && (
        <StickerShowcase id={sticker.id} prompt={sticker.prompt ?? ""} />
      )}
      <div className="mt-auto flex w-full justify-end">
        <div className="rotate-12">
          <Link href="/generate">
            <CircleButton text="RESTART" />
          </Link>
        </div>
      </div>
    </>
  );
}
