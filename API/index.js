// Dependencies
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser') 
const cron = require('../Scraping/cron')

// Cors
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};


// Routes dependecies
const scraperController = require('./controller/scraperController')
const gamesRoutes = require('./routes/games')

const PORT = process.env.PORT || 3000

// definining the app
const app = express()

// adding Helmet to enhance your API's security 
app.use(helmet());

// Logging http requests 
app.use(morgan('combined'));

app.use(
    allowCrossDomain,
    express.json(),
    express.urlencoded({
        extended: false,
    }),
    cookieParser()
)

app.get('/', (request, response) => {
    response.json({ message: 'GMAPI - Gaming Premiers API'})
})

app.use('/games', gamesRoutes)

app.get('/scrape', scraperController.startScraperManually)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ⛴`)
})





