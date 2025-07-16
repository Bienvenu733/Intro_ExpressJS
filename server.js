/********************************* 
           server.js
**********************************/

//Importation of necessary modules
//Importation of the Express framework
const express = require("express");

// Importationn du routeur défini dans le fichier routes/tasks.js
const tasksRouter = require("./routes/tasks");

//Instanciation d'Express
const server = express();

//4-JSON Middleware added to the server
// ce middleware permet de formatter les données JSON dans les requêtes
server.use(express.json());

//5-Port Definition
const PORT = 3000;

/*8- Routes implementation*/

// Montre toutes les routes sous /api/tasks
server.use("/api/tasks", tasksRouter);

//Middleware de gestion globale des erreurs
server.use((err, req, res, next) => {
  console.error(err.stack); // pour debug

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ message });
});

//6-Server Start
server.listen(PORT, () => console.log(`Server is running on port ${PORT}... http://localhost:${PORT}`));