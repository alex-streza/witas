import { decode } from "base64-arraybuffer";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "~/server/supabase/supabaseClient";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
  }

  const { prompt, image } = req.body as {
    prompt: string;
    image: string;
  };

  const { data: stickers } = await supabase()
    .from("Sticker")
    .insert([
      {
        prompt,
      },
    ])
    .select();

  if (stickers) {
    const { data, error } = await supabase()
      .storage.from("stickers")
      .upload(
        `${stickers[0]?.id ?? Math.random() * 10000}.png`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
        decode(image.replace("data:image/png;base64,", "")),
        {
          contentType: "image/png",
        }
      );

    if (error || !data?.path) {
      res.status(500).json({ error });
      return;
    }

    const { error: updateError } = await supabase()
      .from("Sticker")
      .update({
        url: data?.path,
      })
      .eq("id", stickers[0]?.id);

    if (updateError) {
      res.status(500).json({ error: updateError });
      return;
    }

    res.status(200).json({
      message: "Image uploaded",
      status: 200,
    });
  }
};

export default uploadHandler;
