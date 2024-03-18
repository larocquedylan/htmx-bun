import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";

type Todo = { id: number; text: string };
// TODO: create a database
const todos: Todo[] = [];

type TodoRequestBody = { todo: string };
const app = new Elysia()
  .use(swagger())
  .use(html())
  .get("/", () => Bun.file("index.html"))
  // .get("/todos", () => <TodoList todos={todos} />)
  // .post("/todos", ({ body }) => {
  //   const { todo } = JSON.parse(body as string);
  //   todos.push({ id: todos.length + 1, text: todo });
  //   return todos;
  // })
  .get("/todos", ({ html }) => html(<div>todo</div>))
  .get("/check", ({ path, set, html }) => {
    set.headers = { check: "check check" };
    set.headers = { FUCKOUTMYFACE: "check check" };
    set.headers["Content-Type"] = "text/html";
    return html(
      <html lang="en">
        <head>
          <title></title>
        </head>
        <body>
          <h1>the path you dialed: ${path}</h1>
        </body>
      </html>
    );
  })
  .get("/hello", () => "Hi")
  .get("/html", () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  ))

  .get("/hi/:name", ({ params: { name } }) => name)
  .get("/hey/:name", ({ params }) => params)
  .get("/user/:id", ({ params: { id } }) => id, {
    params: t.Object({
      id: t.Numeric(),
    }),
  })
  .get("/song", Bun.file("mixed.mp3"))
  .post("/clicked", ({ html }) => <div> im from the server </div>)
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Route not found :(";
  })
  .listen(3000);

app.handle(new Request("http://localhost/")).then(console.log);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;

function TodoList(props: { todos: Todo[] }): JSX.Element {
  return (
    <ul>
      {props.todos.length
        ? props.todos.map((todo) => <li key={todo.id}> {todo.text}</li>)
        : "No Items Added"}
    </ul>
  );
}
