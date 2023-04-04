
const { request, responde} = require("express")
const express = require('express') // primeiro , importa o express, banco de dados para dentro
const uuid = require('uuid') // biblioteca 
const cors = require("cors")

 /* import express from "express";
import { v4 } from "uuid"; 
import cors from "cors" */


/*  - Query params => meusite.com/users?name=rodolfo&age=28  // usa para FILTROS // em PAGINACAO
    - Route params => /users/   // BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
    - Request Body => { "name": "Rodolfo", "age": 26}

    -GET          => Buscar informacao no Back-End
    -POST         => Criar informacao no Back-ENd
    -PUT / PATCH  => Alterar/Atualizar informacoes no Back-End
    -DELETE        => Deletar informacoes no Back-End

    - Middleware => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisicao
*/    

const port = 3001;
const app = express(); // maneira de facilitar o manuzeio, toda vez q quiser usar o express , utiliza essa formula -- pode ser : app ou server
app.use(express.json()); // essa configuracao sempre tem q vir antes das rotas
app.use(cors())

/*
app.get('/users/:id', (request, response) => { // metedo get , para enviar uma informacao // app.get('/users', (request, response)=>{}) -- metodo padrao utilizado
  // const name = request.query.name
  //const age = request.query.age

  // ou poderia fazer --- const { name, age } = request.query
  // dessa maneira , nao preciso definir minha variavel , pq ele encontra no json aquelas variaveis salvas

  const {id} = request.params
  console.log(id)
  return response.json({id})

 // return response.json({name: name, age: age})
}) */

const users = [];

const checkUserId = (request, response, next) => {
  const { id } = request.params

  const index = users.findIndex((user)  => user.id === id)

  if(index < 0){ // menor que 0 , pq quando encontra uma informacao ele manda o -1
    return response.status(404).json({message:"User not found"}) // status 404 eh nao encontrado
  } 

  request.userIndex = index;

  request.userId = id;

  next();
};

app.get("/users",(request, response)=>{

  return response.json(users);
});

app.post("/users", (request, response)=>{
  const { name, age } = request.body;

  const user = {id: uuid.v4(), name, age }; // uuid.v4() -- ele cria um id unico , universal

  users.push(user);

  return response.status(201).json(user)
})

app.put('/users/:id', checkUserId, (request, response)=>{

  
  const { name, age} = request.body
  const index = request.userIndex

  const id = request.userId

  const updateUser = { id, name, age}
  
  
  users[index] = updateUser

  return response.json(updateUser)
})

app.delete('/users/:id', checkUserId, (request, response)=>{

 // const { id } = request.params

 /*  const index = users.findIndex( user => user.id === id)
  if(index < 0){
    return response.status(404).json({message:"User not found"})
  }
  */

  const index = request.userIndex

  users.splice(index,1)

  return response.status(204).json()
})









app.listen(port, ()=>{
  console.log(`💣 Server started on port ${port}`)
}) // num 3000 eh o numero da minha porta que a aplicacao vai estar rodando