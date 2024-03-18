import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import swagger from "@elysiajs/swagger";
import { Leopard } from "@picovoice/leopard-node";

require("dotenv").config();

if (typeof process.env.PICOVOICE_KEY === "undefined") {
  throw new Error("PICOVOICE_KEY is not set in the environment variables.");
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const todos: Todo[] = [
  { id: uuidv4(), text: "finish this tutorial", completed: false },
];

const app = new Elysia()
  .use(html())
  .use(swagger())
  .get("/", () => Bun.file("voice.html"))
  .get("/todos", () => <TodoList todos={todos} />)
  .post("/todos", ({ body }) => {
    const newTodo = { id: uuidv4(), text: body.todo, completed: false };
    todos.push(newTodo);
    return <TodoItem {...newTodo} />;
  })
  .post("/todos/toggle/:id", ({ params }) => {
    const todo = todos.find((todo) => todo.id === params.id);
    if (todo) {
      todo.completed = !todo.completed;
      return <TodoItem {...todo} />;
    }
  })
  .delete("/todos/delete/:id", ({ params }) => {
    const todo = todos.find((todo) => todo.id === params.id);
    if (todo) {
      todos.splice(todos.indexOf(todo), 1);
    }
  })
  // PICOVOICE
  .post("/upload", ({ body }) => {
    console.log(body);
    console.log("upload was successful");

    try {
      const tempFilePath = `./temp/${body.audioFile.name}`;
      const leopard = new Leopard(process.env.PICOVOICE_KEY!);
      const result = leopard.processFile(tempFilePath);
      console.log(result);
    } catch (error) {
      console.log("error :", error);
    }
    return <div> hey</div>;
  })
  .listen(3000);

app.handle(new Request("http://localhost/")).then(console.log);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;

function TodoItem({ text, completed, id }: Todo): string {
  return (
    <div class="flex flex-row space-x-3">
      <p>{text}</p>
      <input
        type="checkbox"
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div"
        hx-swap="outerHTML"
      />
      <button
        class="text-red-500"
        hx-delete="/todos/delete/:id"
        hx-swap="outerHTML"
        hx-target="closest div">
        {" "}
        X{" "}
      </button>
    </div>
  );
}

function TodoList(props: { todos: Todo[] }) {
  const { todos } = props;
  return (
    <div>
      {todos.map((todo, index) => (
        <TodoItem key={index} {...todo} />
      ))}
    </div>
  );
}
