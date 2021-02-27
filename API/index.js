// Dependencies
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// Routes dependecies
const gamesController = require('./controller/gamesController')
const scraperController = require('./controller/scraperController')

const PORT = process.env.PORT || 3000

// definining the app
const app = express()

// adding Helmet to enhance your API's security 
app.use(helmet());
// enables CORS for all requests
app.use(cors());
// Logging http requests 
app.use(morgan('combined'));



app.use(
    express.json(),
    express.urlencoded({
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
app.post('/scrape', scraperController.startScraperManually)

