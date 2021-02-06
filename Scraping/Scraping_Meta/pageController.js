const pageScraper = require('./pageScraper')
const fs = require('fs');

async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        let scrapedData = {};
        scrapedData['PC'] = await pageScraper.scraper(browser)
        console.log(scrapedData)
        await browser.close()
    } catch(err) {
        console.log("Could not resolve the browser instance => ", err)
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)
