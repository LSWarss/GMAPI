const express = require('express')
const gamesRoutes = express.Router()
const gamesController = require('../controller/gamesController')

gamesRoutes.get('/', gamesController.getGames)
gamesRoutes.get('/title', gamesController.getGameByTitle)
gamesRoutes.get('/platform/:name', gamesController.getGamesByPlatform)
gamesRoutes.get('/:id', gamesController.getGame)

module.exports = gamesRoutes