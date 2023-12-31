import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  defaultOutputSchema,
  replicateWebhookInputSchema,
} from "~/utils/schema";
import mixpanel from "mixpanel-browser";
import { Resend } from "resend";
import { env } from "~/env.mjs";
import { NotifyEmail } from "~/components/emails/notify";
import Replicate from "replicate";

const WEBHOOK_URL = `${
  "https://witas.vercel.app" ??
  "https://1855-2a02-2f04-e506-2900-6651-c6e0-ed4b-14d4.ngrok.io"
}/api/webhooks/replicate`;

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
        stickerId: z.number(),
        image: z.string(),
      })
    )
    .output(defaultOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const replicate = new Replicate({
        auth: env.REPLICATE_API_TOKEN,
      });

      const modelUpscaleVersion =
        "42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b";

      const data = await replicate.predictions.create({
        version: modelUpscaleVersion,
        input: {
          ...input,
          scale: 8,
        },
        webhook: `${WEBHOOK_URL}?stickerId=${input.stickerId}&type=upscale`,
        webhook_events_filter: ["completed"],
      });

      return {
        message: "Image optimization started",
        status: 200,
      };
    }),
  upscaleWebhook: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/webhooks/replicate",
      },
    })
    .input(replicateWebhookInputSchema)
    .output(defaultOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const { type, stickerId } = ctx.query as {
        type: string;
        stickerId: string;
      };

      console.log("LOG WEBHOOK:", type, stickerId, input);

      if (input.status !== "succeeded") {
        return {
          status: 200,
          message: "Replicate webhook received",
        };
      }

      if (type === "upscale") {
        const modelRemBgVersion =
          "e809cddc666ccfd38a044f795cf65baab62eedc4273d096bf05935b9a3059b59";
        const replicate = new Replicate({
          auth: env.REPLICATE_API_TOKEN,
        });

        const data = await replicate.predictions.create({
          version: modelRemBgVersion,
          input: {
            image: input.output,
          },
          webhook: `${WEBHOOK_URL}?stickerId=${stickerId}&type=rembg`,
          webhook_events_filter: ["completed"],
        });
        console.log("LOG WEBHOOK:", data);
      } else {
        if (!input.output)
          return {
            status: 200,
            message: "Replicate webhook received",
          };

        const response = await fetch(input.output);
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();

        const fileName = `${stickerId}_v${Math.floor(
          Math.random() * 10000
        )}.png`;

        await ctx.supabase.storage
          .from("optimized")
          .upload(fileName, arrayBuffer, {
            contentType: "image/png",
          });

        await ctx.supabase.from("replicate_jobs").insert([
          {
            id: input.id,
            status: input.status,
            result: fileName,
            stickerId: Number(stickerId),
            type,
          },
        ]);
      }

      return {
        status: 200,
        message: "Replicate webhook received",
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
  notifyOptimizedStickers: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/notify",
      },
    })
    .input(z.void())
    .output(defaultOutputSchema)
    .mutation(async ({ ctx }) => {
      const { data: jobs } = await ctx.supabase
        .from("replicate_jobs")
        .select("*, stickers(users(email))")
        .eq("notified", false)
        .like("status", "succeeded")
        .like("type", "rembg");

      const jobsGroupedByUser =
        jobs?.reduce(
          (
            acc: {
              [key: string]: typeof jobs;
            },
            job
          ) => {
            const user = job.stickers?.users;

            if (!user) return acc;

            const email = user.email as keyof typeof acc;

            if (!acc[email]) {
              acc[email] = [];
            }

            acc[email]?.push(job);

            return acc;
          },
          {}
        ) ?? {};

      const resend = new Resend(env.RESEND_API_KEY);

      for (const [email, jobs] of Object.entries(jobsGroupedByUser)) {
        try {
          await resend.sendEmail({
            from: "witas@morrow.to",
            to: email,
            subject: "WITAS - AI Stickers",
            react: <NotifyEmail images={jobs.map((job) => job.result ?? "")} />,
          });

          await ctx.supabase
            .from("replicate_jobs")
            .update({ notified: true })
            .in(
              "id",
              jobs.map((job) => job.id)
            );
        } catch (error) {
          console.log("error", error);
        }
      }
      return {
        status: 200,
        message: "Stickers notified",
      };
    }),
});
