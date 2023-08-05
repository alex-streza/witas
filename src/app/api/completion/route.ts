import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { env } from "~/env.mjs";

// Create an OpenAI API client (that's edge friendly!)
const openAIConfig = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openAIConfig);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { styles, prompt } = (await req.json()) as {
    prompt: string;
    styles: string;
  };

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an experienced AI prompt engineer",
      },
      {
        role: "user",
        content:
          "Generate a prompt for a sticker image generation given the following:",
      },
      {
        role: "user",
        content:
          'Sample prompt for image generation: "A sticker of {SUBJECT HERE} character, {STYLES SPLIT BY COMMA HERE}"',
      },
      {
        role: "user",
        content:
          "The generated prompt should be at most 200 characters long and not contain quotes",
      },
      {
        role: "user",
        content:
          "The generated prompt should be all lowercase and must start with a sticker",
      },
      {
        role: "user",
        content:
          "Prompt subject and styles can change according to user inputs",
      },
      {
        role: "assistant",
        content: `Styles are "${styles}" and subject is ${prompt}`,
      },
    ],
    stream: true,
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log("response", response);

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
