const { scraper } = require('../../Scraping/scrape')
const { pool } = require("../model/db")

const startScraperManually = (request, response) => {
    scraper()
        response.status(202).json({ message: 'Started manual scraping'})
}


module.exports = {
    startScraperManually
}