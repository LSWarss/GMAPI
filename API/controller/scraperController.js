const { scraper } = require('../../Scraping/scrape')

const startScraperManually = (request, response) => {

    // const { scrapToken } = request.body

    // if(scrapToken === process.env.SCRAP_TOKEN) {
        scraper()
        response.status(202).json({ message: 'Started manual scraping'})
    // } else {
    //     response.status(400).json({ message: 'Wrong scrap token'})
    // }
    
}


module.exports = {
    startScraperManually
}