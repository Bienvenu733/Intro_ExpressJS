/****************
 * tasks.js
 ****************/

//Importation d'Express
const express = require("express");
//Importation d'uuid pour générer des IDs uniques
/* Pour installer --> npm install uuid */
const { v4: uuidv4 } = require("uuid");

//Création du routeur
const router = express.Router();

// Simule une base en mémoire partagée
let tasks = [];

// GET --> Récupérer toutes les tâches
router.get("/", (req, res) => {
  res.json(tasks);
});

// GET -- Récupérer une tâche par ID
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return next({ status: 404, message: "Task not found" });
  }

  res.json(task);
});

// POST -- Create une nouvelle tâche
router.post("/", (req, res, next) => {
  const { title } = req.body;

  // Vérifie que title existe ET qu'il reste du texte après trim()
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return next({
      status: 400,
      message: "The 'title' field is required and must be a non-empty string.",
    });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH --> Mise à jour partielle d'une tâche
router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  const { completed } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return next({ status: 404, message: "Task not found" });
  }

  if (completed === undefined) {
    return next({ status: 400, message: "The 'completed' field is required" });
  }

  if (typeof completed !== "boolean") {
    return next({
      status: 400,
      message: "The 'completed' field must be a boolean (true or false)",
    });
  }

  task.completed = completed;

  res.json(task);
});

// PUT --> Mise à jour complète d'une tâche
router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const { title, completed } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) return next({ status: 404, message: "Task not found" });

  if (completed !== undefined && typeof completed !== "boolean") {
    return next({
      status: 400,
      message: "The 'completed' field must be a boolean (true or false)",
    });
  }

    // Si title est fourni, on le valide aussi
  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return next({
        status: 400,
        message: "The 'title' must be a non-empty string.",
      });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// DELETE --> Suppression d'une tâche
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return next({ status: 404, message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(200).json({ message: "Tâche supprimée avec succès" });
});

module.exports = router;
