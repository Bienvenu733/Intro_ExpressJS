/*****************************
 * Routes for Task Management *
 *****************************/

//express framework import
const express = require("express");

// création du mini routeur pour organiser les routes de façon modulaire
const router = express.Router();

// Importation de la bibliothèque uuid pour générer des identifiants uniques
/* note : uuidv4 est utilisé pour générer des identifiants uniques pour les tâches
    pour l'intaller --> npm install uuid */
const { v4: uuidv4 } = require('uuid');

// Simule une base en mémoire partagée
let tasks = [];

// GET --> Récupérer toutes les tâches
router.get("/", (req, res) => {
  res.json(tasks);
});

// GET --> Récupérer une tâche par ID
router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return next({ status: 404, message: "Task not found" });
  }

  res.json(task);
});

// POST --> Créer une nouvelle tâche
router.post("/", (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    return next({ status: 400, message: "Title is required" });
  }

  const newTask = {
    // Utilisation de uuidv4 pour générer un identifiant unique
    id: uuidv4(),
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PATCH --> Mise à jour partielle (completed) d'une tâche par ID
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

  // Vérification que completed est un booléen
    if (typeof completed !== "boolean") {
      return next({
        status: 400,
        message: "The 'completed' field must be a boolean (true or false)",
      });
    }
    task.completed = completed;

  res.json(task);
});

// DELETE --> Supprimer une tâche par ID
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return next({ status: 404, message: "Task not found" });
  }

  tasks.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router;
