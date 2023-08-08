import { Generate } from "~/components/generate";
import { supabase } from "~/server/supabase/supabaseClient";

export default async function Page() {
  const { count = 0 } = await supabase()
    .from("Sticker")
    .select("id", { count: "exact" });

  const maxCount = count ?? 0;

  const { data } = await supabase()
    .from("Sticker")
    .select("*")
    .range(Math.random() * maxCount, Math.random() * maxCount + maxCount)
    .limit(9);

  const images = Array.from({
    length: 9,
  }).map((_, i) => `https://source.unsplash.com/random/300×300?t=${i}`);

  return (
    <>
      <Generate
        // images={images}
        images={(data ?? []).map((sticker) => sticker.url ?? "")}
      />
    </>
  );
}
