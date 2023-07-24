// Servidor Express

// Para probar los ficheros estáticos del fronend, entrar en <http://localhost:4500/>
// Para probar el API, entrar en <http://localhost:4500/api/items>

// Imports

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require('dotenv').config()



// Arracar el servidor

const server = express();

// Configuración del servidor

server.use(cors());
server.use(express.json({limit: "25mb"}));
// server.set('view engine', 'ejs');



// Conexion a la base de datos

async function getConnection() {
  const connection = await mysql.createConnection(
    {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS, 
      database: process.env.DB_NAME || "recetas_db",
    }
  );

  connection.connect();

  return connection;
}



// Poner a escuchar el servidor

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Ya se ha arrancado nuestro servidor: http://localhost:${port}/`);
});



// Endpoints

// GET /recetas
//obtener todos los datos de la BD

server.get("/recetas", async (req, res) => {
  const selectRecetas = "SELECT * FROM recetas ";
  const conn = await getConnection();
  const [results] = await conn.query(selectRecetas);

  conn.end();

  res.json ({
    info: {
        count: results.length, //número de elementos del listado.
    },
    results: results //listado  de recetas.
})
});



// GET /recetas/:id
// Obtener una receta por su id

server.get("/recetas/:id", async (req, res) => {
  const recetaId = req.params.id;
  const selectId = "SELECT * FROM recetas WHERE id = ?";
  const conn = await getConnection();
  const [results] = await conn.query(selectId, [recetaId]);

  conn.end();

  res.json (results);
  
});



