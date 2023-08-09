import { z } from "zod";

export const defaultOutputSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export const replicateWebhookInputSchema = z.object({
  id: z.string(),
  version: z.string(),
  created_at: z.string(),
  started_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  status: z.string(),
  input: z.object({
    image: z.string(),
  }),
  output: z.string().nullable(),
  error: z.string().nullable(),
  logs: z.string().nullable(),
  metrics: z.object({}),
});
