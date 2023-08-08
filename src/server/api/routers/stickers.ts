import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { defaultOutputSchema } from "~/utils/schema";

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
});
