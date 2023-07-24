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
      host: process.env.DB_HOST || "sql.freedb.tech",
      user: process.env.DB_USER || "freedb_cristina",
      password: process.env.DB_PASS, 
      database: process.env.DB_NAME || "freedb_recetas_db",
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

//POST/recetas
//insertar en el body la info de una receta.La respuesta debe ser un json con la info de si fue exitosa y su id.

server.post("/recetas", async (req, res) => {
  const newReceta = req.body;
  try{

  const insert = "INSERT INTO recetas (nombre, ingredientes, instrucciones) VALUES (?, ?, ?)";
  const conn = await getConnection();
  const [results] = await conn.query(insert, [ newReceta.nombre, newReceta.ingredientes, newReceta.instrucciones]); 
  conn.end();
  

  res.json ({
      success: true,
      id: results.insertId,
  });
  console.log(newId)
  } catch (error) {
    res.json ({
      success: false,//Puede ser true o false
      message:("Revisa tus datos, tienes algun error")
  });
  }
});

//PUT/recetas/:id
//Actualizar una receta donde el id es el identificador de dicha receta.Se espera por el body la receta actualizada.La respuesta sera un json true o false con sus mensajes.
server.put("/recetas/:id", async (req, res) => {
  const recetaId = req.params.id;
  const {nombre, ingredientes, instrucciones} = req.body;
  try{

  const update = "UPDATE recetas SET nombre= ?, ingredientes= ?, instrucciones= ? WHERE id = ?";
  const conn = await getConnection();
  const [result] = await conn.query(update, [nombre, ingredientes, instrucciones, recetaId]);
  conn.end();

  res.json ({
      success: true 
  });
  } catch (error) {
    res.json ({
      success: false,
      message: error,
  });
  }
});

//DELETE/recetas/:id
//Eliminar una receta donde el id es la receta a eliminar.La respuesta será un json si fue exitosa o no.
server.delete("/recetas/:id", async (req, res) => {
  const recetaId = req.params.id;
  try{

  const deleteSql = "DELETE FROM recetas WHERE id= ?";
  const conn = await getConnection();
  const [result] = await conn.query(deleteSql, [recetaId]);
  conn.end();

  res.json ({
      success: true 
  });
  } catch (error) {
    res.json ({
      success: false,
      message: ("Ha ocurrido un error"),
  });
  }
});


