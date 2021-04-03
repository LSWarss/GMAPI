const { scrapeComingSoonForAllSupportedPlatforms } = require("../../Scraping/Pupeeteer/metacritic")

const startScraperManually = (request, response) => {
        scrapeComingSoonForAllSupportedPlatforms()
        response.status(202).json({ message: 'Started manual scraping'})
}


module.exports = {
    startScraperManually
}