import { htmx } from "htmx.org";

const server = Bun.serve({
  hostname: "localhost",
  port: 8080,
  fetch: handler,
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
console.log(`Press Ctrl+C to stop the server`);

function handler(request: Request): Response {
  const url = new URL(request.url);
  return new Response("Not Found", { status: 404 });
}
