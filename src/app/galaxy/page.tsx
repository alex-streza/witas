// import { ParticlesCanvas } from "~/components/galaxy";
import { supabase } from "~/server/supabase/supabaseClient";

export default async function Page() {
  const { data: colors } = await supabase().from("colors").select("*");

  return (
    <div>
      {/* <ParticlesCanvas
        particles={
          colors && colors?.length > 0
            ? colors.map((color) => ({
                stickerId: color.stickerId,
                color: color.color,
              }))
            : [
                ...Array.from({ length: 2000 }).map((_, i) => ({
                  stickerId: i,
                  color: `#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`,
                })),
              ]
        }
      /> */}
    </div>
  );
}
