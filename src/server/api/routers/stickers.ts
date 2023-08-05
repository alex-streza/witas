import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { defaultOutputSchema } from "~/utils/schema";

export const stickersRouter = createTRPCRouter({
  removeBackground: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/remove-background",
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
      const model =
        "ilkerc/rembg:e809cddc666ccfd38a044f795cf65baab62eedc4273d096bf05935b9a3059b59";
      const output = (await ctx.replicate.run(model, {
        input,
      })) as unknown as string;

      return {
        message: "Image uploaded",
        status: 200,
        url: output,
      };
    }),
  upscaleImage: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/upscale",
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
      const model =
        "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";
      const output = (await ctx.replicate.run(model, {
        input: {
          ...input,
          scale: 8,
        },
      })) as unknown as string;

      return {
        message: "Image upscaled",
        status: 200,
        url: output,
      };
    }),
});
