import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";

import { createOpenApiNextHandler } from "trpc-openapi";

export default createOpenApiNextHandler({
  router: appRouter,
  createContext: createTRPCContext,
});
