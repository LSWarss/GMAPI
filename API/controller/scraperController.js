const { scraper } = require('../../Scraping/scrape')
const { pool } = require("../model/db")

const startScraperManually = (request, response) => {

    const { scrapToken } = request.body

    if(scrapToken === process.env.SCRAP_TOKEN) {
        scraper()
        pool.query('SELECT * FROM games ORDER BY release_date ASC', (error, results) => {
            if (error) {
                throw error
            }
            response.status(202).json({ message: 'Started manual scraping', results})
        })
    } else {
        response.status(400).json({ message: 'Wrong scrap token'})
    }

  
}


module.exports = {
    startScraperManually
}