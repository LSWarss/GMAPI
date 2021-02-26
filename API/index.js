const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const gamesController = require('./controller/gamesController')
const scraperController = require('./controller/scraperController')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ message: 'GMAPI - Gaming Premiers API'})
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ⛴`)
})

app.get('/games', gamesController.getGames)
app.get('/games/platform/:name', gamesController.getGamesByPlatform)
app.get('/games/:id', gamesController.getGame)
app.post('/games', gamesController.createGame)
app.post('/scrape', scraperController.startScraperManually)
app.put('/games/:id', gamesController.updateGame)
app.delete('/games/:id', gamesController.deleteGame)

