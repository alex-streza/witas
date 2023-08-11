import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    SUPABASE_SERVICE_KEY: z.string().min(1),
    DIRECT_URL: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    REPLICATE_API_TOKEN: z.string().min(1),
    WS: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    SERVER_ID: z.string().min(1).optional(),
    CHANNEL_ID: z.string().min(1).optional(),
    SALAI_TOKEN: z.string().min(1).optional(),
    HUGGINGFACE_TOKEN: z.string().min(1).optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SELF_HOSTING: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    DIRECT_URL: process.env.DIRECT_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    NEXT_PUBLIC_SELF_HOSTING: process.env.NEXT_PUBLIC_SELF_HOSTING,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SERVER_ID: process.env.SERVER_ID,
    CHANNEL_ID: process.env.CHANNEL_ID,
    SALAI_TOKEN: process.env.SALAI_TOKEN,
    HUGGINGFACE_TOKEN: process.env.HUGGINGFACE_TOKEN,
    WS: process.env.WS,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
});
