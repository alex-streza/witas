import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  defaultOutputSchema,
  replicateWebhookInputSchema,
} from "~/utils/schema";

export const stickersRouter = createTRPCRouter({
  optimizeImage: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/optimize",
      },
    })
    .input(
      z.object({
        image: z.string(),
      })
    )
    .output(
      defaultOutputSchema.extend({
        url: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const modelUpscale =
        "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
      const outputUpscale = (await ctx.replicate.run(modelUpscale, {
        input: {
          ...input,
          scale: 8,
        },
        webhook: `${
          process.env.VERCEL_URL ?? "http://localhost:3000"
        }/api/upscale-webhook`,
        webhook_events_filter: ["completed"],
      })) as unknown as string;

      const modelRemBg =
        "ilkerc/rembg:e809cddc666ccfd38a044f795cf65baab62eedc4273d096bf05935b9a3059b59";
      const outputRemBg = (await ctx.replicate.run(modelRemBg, {
        input: {
          image: outputUpscale,
        },
      })) as unknown as string;

      return {
        message: "Image upscaled",
        status: 200,
        url: outputRemBg,
      };
    }),
  upscaleWebhook: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/upscale-webhook",
      },
    })
    .input(replicateWebhookInputSchema)
    .output(defaultOutputSchema)
    .mutation(({ input, ctx }) => {
      console.log("input", input);

      return {
        status: 200,
        message: "Upscale webhook received",
      };
    }),
  addColors: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/colors",
      },
    })
    .input(
      z.object({
        colors: z.array(
          z.object({
            color: z.string(),
            percentage: z.number(),
            name: z.string(),
            stickerId: z.number(),
          })
        ),
      })
    )
    .output(defaultOutputSchema)
    .mutation(async ({ input: { colors }, ctx }) => {
      const { count } = await ctx.supabase
        .from("colors")
        .select("count", { count: "exact" })
        .eq("stickerId", colors[0]?.stickerId)
        .single();

      if (count) {
        return {
          status: 200,
          message: "Colors added",
        };
      }

      const { error } = await ctx.supabase.from("colors").insert(colors);

      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });

      return {
        status: 200,
        message: "Colors added",
      };
    }),
});
