const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const UserRepository = require("./user-repository");
const bodyParser = require("body-parser");
// const { ObjectId } = require('bson');
const cors = require("cors");
// const { request } = require('express');

const app = express();
app.use(bodyParser.json());
// Coloquei esse Middle para fazer um teste
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Esse middle foi usado para permitir trabalhar com corcs
app.use(
  cors({
    allowedHeaders: ["X-Total-Count", "Content-type"],
    exposedHeaders: ["X-Total-Count", "Content-type"],
  })
);

let userRepository;
let client;
let connected = false;

/* Criou-se um middle para poder fazer conexão como o banco de dados
  antes de receber a conexão http.
*/

app.use(async (req, res, next) => {
  if (!connected) {
    const uri = "mongodb://localhost";
    client = new MongoClient(uri);
    await client.connect();
    const collection = client.db("users_db").collection("users");
    userRepository = new UserRepository(collection);
    connected = true;
  }
  next();
});

app.get("/users", async (request, response) => {
  // Coloquei o TryCatch, pois no tratamento do findAll() estou gerando exceção para caso não ache nenhum valor
  try {
    const users = await userRepository.findAll();
    response.setHeader("X-Total-Count", users.length); // Coloquei para atender os requisitos do react-admin
    response.status(200).json(users);
  } catch (error) {
    response.setHeader("X-Total-Count", 0); // Foi necessário colocar para permitir trabalhar com X-Total-count
    response.status(200).json([]);
  }
});

app.post("/users", async (request, response) => {
  // Coloquei o TryCatch, pois no tratamento do findAll() estou gerando exceção para caso não ache nenhum valor
  const user = await userRepository.insert(request.body);
  response.status(201).json(user);
});

app.get("/users/:id", async (request, response) => {
  try {
    const user = await userRepository.findOneById(ObjectId(request.params.id)); // params id vem pela url conforme o parametro que coloquei na rota
    // response.status(200).json(user); //Por padrão irá retornar o statusCode 200
    response.json(user);
  } catch (error) {
    response.status(404).json({
      message: "User not found",
      code: 404,
    });
  }
});

// O delete foi criado para esta aula e ainda não foi testado.
app.delete("/users/:id", async (request, response) => {
  try {
    await userRepository.delete(ObjectId(request.params.id));
    // response.status(200).json(request.body)
    response.status(200).json({
      message: "User delete with success",
      code: 200,
    });
  } catch (e) {
    // console.log(e.message)
    response.status(404).json({
      message: "User not found",
      code: 404,
    });
  }
});

app.put("/users/:id", async (request, response) => {
  try {
    // console.info(request.body);
    // console.info(ObjectId(request.params.id));
    const user = await userRepository.update(
      ObjectId(request.params.id),
      request.body
    ); // Ess é a versão que usarei
    // const user = await userRepository.update(request.body);
    response.status(200).json(user);
  } catch (e) {
    response.status(404).json({
      message: "User not found",
      code: 404,
    });
  }
});

module.exports = app;
