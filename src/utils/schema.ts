import { z } from "zod";

export const defaultOutputSchema = z.object({
  status: z.number(),
  message: z.string(),
});
