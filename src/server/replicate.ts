import Replicate from "replicate";

import { env } from "~/env.mjs";

const globalForReplicate = globalThis as unknown as {
  replicate: Replicate | undefined;
};

export const replicate =
  globalForReplicate.replicate ??
  new Replicate({
    // get your token from https://replicate.com/account
    auth: env.REPLICATE_API_TOKEN,
  });

if (env.NODE_ENV !== "production") globalForReplicate.replicate = replicate;
