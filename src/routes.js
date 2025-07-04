import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Titulo e descrição são obrigatórios." })
          );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: null,
      };

      database.insert("tasks", task);

      res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "Titulo e descrição são obrigatórios." })
          );
      }

      const task = database.selectById("tasks", id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Tarefa não encontrada." }));
      }

      task.title = title;
      task.description = description;
      task.updatedAt = new Date();

      database.update("tasks", id, task);

      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      const task = database.selectById("tasks", id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Tarefa não encontrada." }));
      }

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.selectById("tasks", id);

      if (!task) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ message: "Tarefa não encontrada." }));
      }

      task.completedAt = new Date();
      task.updatedAt = new Date();
      database.update("tasks", id, task);
      return res.writeHead(204).end();
    },
  },
];
