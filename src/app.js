const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function findRepositoryId(request, response, next) {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  
  request.locals = { id, repositoryIndex }
  next()
}

function validateRepositoryId(request, response, next) {
  const { id, repositoryIndex } = request.locals

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found' })
  }

  request.locals = { id, repositoryIndex }
  next()
}

app.use('/repositories/:id', findRepositoryId, validateRepositoryId)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0 
  }

  repositories.push(repository)

  return response.status(201).json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id, repositoryIndex } = request.locals
  const { title, url, techs } = request.body

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request.locals

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { repositoryIndex } = request.locals

  const repository = repositories[repositoryIndex]
  
  repository.likes++

  return response.json(repository)
});

module.exports = app;
