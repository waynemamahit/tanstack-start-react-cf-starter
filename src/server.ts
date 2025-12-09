import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
	fetch: handler.fetch,
});
export { Counter } from "./server/durable-objects/counter.do";
