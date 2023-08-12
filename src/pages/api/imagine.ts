import { Midjourney } from "midjourney";
import { env } from "~/env.mjs";

type ResponseError = {
  message: string;
};

export const config = {
  runtime: "edge",
};

const handler = async (req: Request) => {
  const { prompt, serverId, channelId, authorization } = (await req.json()) as {
    prompt: string;
    serverId: string;
    channelId: string;
    authorization: string;
  };

  console.log("imagine.handler", prompt, serverId, channelId, authorization);
  const client = new Midjourney({
    ServerId: serverId ?? env.SERVER_ID,
    ChannelId: channelId ?? env.CHANNEL_ID,
    SalaiToken: authorization ?? env.SALAI_TOKEN,
    HuggingFaceToken: env.HUGGINGFACE_TOKEN,
    Ws: env.WS === "true",
    Debug: process.env.NODE_ENV === "development",
  });

  await client.init();

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    start(controller) {
      console.log("imagine.start", prompt);
      client
        .Imagine(prompt, (uri: string, progress: string) => {
          console.log("imagine.loading", uri);
          controller.enqueue(encoder.encode(JSON.stringify({ uri, progress })));
        })
        .then((msg) => {
          console.log("imagine.done", msg);
          controller.enqueue(encoder.encode(JSON.stringify(msg)));
          client.Close();
          controller.close();
        })
        .catch((err: ResponseError) => {
          console.log("imagine.error", err);
          client.Close();
          controller.close();
        });
    },
  });

  return new Response(readable, {});
};
export default handler;
