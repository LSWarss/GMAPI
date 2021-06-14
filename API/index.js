// Dependencies
const express = require('express'),
helmet = require('helmet'),
morgan = require('morgan'),
cookieParser = require('cookie-parser'),
rateLimit = require('express-rate-limit');
// const cron = require('../Scraping/cron')

// Enpoint limits 
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, // limit
    message: "Too many requests from this IP, try again in 15 minutes" 
});

const scrapeLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: "Too many requests for scraping"
})

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
    response.sendFile('./static/index.html', { root: __dirname });
})

app.use('/games', limiter, gamesRoutes)

app.get('/scrape', scrapeLimiter, scraperController.startScraperManually)

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ⛴`)
})





