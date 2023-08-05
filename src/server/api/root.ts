import { generateOpenApiDocument } from "trpc-openapi";
import { stickersRouter } from "~/server/api/routers/stickers";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sticker: stickersRouter,
});

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "WITAS OpenAPI",
  version: "0.0.1",
  baseUrl: "http://localhost:3000",
});

// export type definition of API
export type AppRouter = typeof appRouter;
