import Link from "next/link";
import { CircleButton } from "~/components/circle-button";
import { StickerShowcase } from "~/components/sticker-showcase";
import { supabase } from "~/server/supabase/supabaseClient";

export default async function Page({ params }: { params: { id: string } }) {
  const { data: sticker } = await supabase()
    .from("Sticker")
    .select("*")
    .eq("id", params.id)
    .single();

  return (
    <>
      {sticker && (
        <StickerShowcase id={sticker.id} prompt={sticker.prompt ?? ""} />
      )}
      <div className="absolute -bottom-12 right-1/2 translate-x-1/2 rotate-12">
        <Link href="/generate">
          <CircleButton text="GO" />
        </Link>
      </div>
    </>
  );
}
