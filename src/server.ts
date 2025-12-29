import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

type Bindings = {
	MY_VARIABLE: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Logger middleware - logs all requests
app.use("*", logger());

// Secure Headers middleware - adds security headers
app.use("*", secureHeaders());

// CORS middleware - configure allowed origins
app.use("*", cors());

// CSRF Protection middleware - protect against CSRF attacks
app.use("*", csrf());

// API routes example
app.get("/api/health", (c) => {
	return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// TanStack Start SSR handler - must be after custom routes
app.use("*", async (c) => {
	return await handler.fetch(c.req.raw);
});

export default createServerEntry({
	fetch: app.fetch,
});

export { Counter } from "./server/durable-objects/counter.do";
