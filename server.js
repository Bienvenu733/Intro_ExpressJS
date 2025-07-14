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
let tasks = [
  { id: 1, title: "Apprendre Express", completed: false },
  { id: 2, title: "Faire une API", completed: true },
];
let nextId = 1;

/*8- Routes implementation*/

// server.get
// GET /api/tasks to get all tasks
server.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET /api/tasks/:id to get a task by ID
server.get("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
});

// server.post
// POST /api/tasks to create a new task
server.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
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
server.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;

  // Reaserch the ID in the request in the tasks array
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Update the task properties if provided
  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// server.delete
// DELETE /api/tasks/:id to delete a task by ID
server.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.sendStatus(204);
});

//6-Server Start
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
