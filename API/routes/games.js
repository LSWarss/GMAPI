const express = require('express')
const gamesRoutes = express.Router()
const gamesController = require('../controller/gamesController')

gamesRoutes.get('/', gamesController.getGames)
gamesRoutes.get('/title', gamesController.getGameByTitle)
gamesRoutes.get('/platform/:name', gamesController.getGamesByPlatform)
gamesRoutes.get('/platforms', gamesController.getPlatforms)
gamesRoutes.get('/developers', gamesController.getDevelopers)
gamesRoutes.get('/genres', gamesController.getGenres)

module.exports = gamesRoutes