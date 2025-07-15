/********************************* 
           server.js
**********************************/

//Importation of necessary modules
//2-Importation of the Express framework
const express = require("express");

//3-Creation of the Express server instance
const server = express();

//4-JSON Middleware added to the server
server.use(express.json());

//5-Port Definition
const PORT = 3000;

//7- In-memory data store
let tasks = [];
let nextId = 1;

/*8- Routes implementation*/

// server.get
// GET /api/tasks to get all tasks
server.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET /api/tasks/:id to get a task by ID
server.get("/api/tasks/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return next({ status: 404, message: "Task not found" });
  }

  res.json(task);
});

// server.post
// POST /api/tasks to create a new task
server.post("/api/tasks", (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next({ status: 400, message: "Title is required" });
  }

  const newTask = {
    id: nextId++,
    title,
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// server.put
// PUT /api/tasks/:id to update a task by ID
server.put("/api/tasks/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return next({ status: 404, message: "Task not found" });
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return next({
      status: 400,
      message: "The 'completed' field must be a boolean (true or false)",
    });
  }

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// server.delete
// DELETE /api/tasks/:id to delete a task by ID
server.delete("/api/tasks/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return next({ status: 404, message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.sendStatus(204);
});

//Middleware de gestion globale des erreurs
server.use((err, req, res, next) => {
  console.error(err.stack); // pour debug

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
});

//6-Server Start
server.listen(PORT, () => console.log(`Server is running on port ${PORT}... http://localhost:${PORT}`));
