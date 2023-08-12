import { Generate } from "~/components/generate";
import { supabase } from "~/server/supabase/supabaseClient";

const baseUrl =
  "https://eiuckazvagocqjiisium.supabase.co/storage/v1/object/public/optimized";

const images = Array.from({ length: 27 }).map(
  (_, i) => `${baseUrl}/p (${i + 1}).png`
);

export default function Page() {
  const randomizedImages = images.sort(() => Math.random() - 0.5).slice(0, 9);

  return (
    <>
      <Generate images={randomizedImages} />
    </>
  );
}
