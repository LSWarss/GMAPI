const { scrapAllUrls } = require('../../Scraping/scrape')


const startScraperManually = (request, response) => {

    const { scrapToken } = request.body

    if(scrapToken === process.env.SCRAP_TOKEN) {
        scrapAllUrls()
        response.status(202).json({ message: 'Started manual scraping'})
    } else {
        response.status(400).json({ message: 'Wrong scrap token'})
    }

    pool.query('SELECT * FROM games ORDER BY release_date ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


module.exports = {
    startScraperManually
}