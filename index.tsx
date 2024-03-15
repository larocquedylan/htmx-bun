import { htmx } from "htmx.org";
import { renderToString } from "react-dom/server";

const server = Bun.serve({
  hostname: "localhost",
  port: 8080,
  fetch: handler,
});

type Todo = { id: number; text: string };
const todos: Todo[] = [];

type TodoRequestBody = { todo: string };

console.log(`Listening on http://${server.hostname}:${server.port}`);
console.log(`Press Ctrl+C to stop the server`);

async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // to do: make elysia server
  // but for now
  if (url.pathname === "" || url.pathname === "/") {
    return new Response(Bun.file("index.html"));
  }

  // accept the submission from form
  if (url.pathname === "/todos" && request.method === "POST") {
    // the to do will be in the request body
    const { todo } = (await request.json()) as TodoRequestBody;

    if (!todo?.length) return new Response("Invalid Input", { status: 500 });

    todos.push({
      id: todos.length + 1,
      text: todo,
    });

    return new Response(renderToString(<TodoList todos={todos} />));
  }

  // accept the get todo items from form
  if (url.pathname === "/todos" && request.method === "GET") {
    return new Response(renderToString(<TodoList todos={[]} />));
  }

  return new Response("Not Found", { status: 404 });
}

function TodoList(props: { todos: Todo[] }) {
  return (
    <ul>
      {props.todos.length
        ? props.todos.map((todo) => <li key={todo.id}> {todo.text}</li>)
        : "No Items Added"}
    </ul>
  );
}
