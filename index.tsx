import { htmx } from "htmx.org";
import { renderToString } from "react-dom/server";

const server = Bun.serve({
  hostname: "localhost",
  port: 8080,
  fetch: handler,
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
console.log(`Press Ctrl+C to stop the server`);

function handler(request: Request): Response {
  const url = new URL(request.url);

  // to do: make elysia server
  // but for now
  if (url.pathname === "" || url.pathname === "/") {
    return new Response(Bun.file("index.html"));
  }

  // accept the submission from form
  if (url.pathname === "/todos" && request.method === "POST") {
    return new Response(renderToString(<TodoList todos={[]} />));
  }

  // accept the get todo items from form
  if (url.pathname === "/todos" && request.method === "GET") {
    return new Response(renderToString(<TodoList todos={[]} />));
  }

  return new Response("Not Found", { status: 404 });
}

function TodoList(props: { todos: { id: number; text: string }[] }) {
  return (
    <ul>
      {props.todos.length
        ? props.todos.map((todo) => <li> {todo.text}</li>)
        : "No Items Added"}
    </ul>
  );
}
