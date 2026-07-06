import type { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

// Serves the Vite-built SPA (dist/public) from the production server.
// The frontend uses HashRouter, so no history-mode fallback is needed —
// every route lives under "/" and is resolved client-side.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serveStaticFiles(app: Hono<any>) {
  app.use("/*", serveStatic({ root: "./dist/public" }));
  app.use("/*", serveStatic({ path: "./dist/public/index.html" }));
}
