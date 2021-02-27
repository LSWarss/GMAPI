// Dependencies
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// Routes dependecies
const scraperController = require('./controller/scraperController')
const gamesRoutes = require('./routes/games')

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

app.use('/games', gamesRoutes)

app.post('/scrape', scraperController.startScraperManually)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ⛴`)
})




