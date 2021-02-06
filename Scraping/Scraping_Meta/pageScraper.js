const scraperObject = {
    url: 'https://www.metacritic.com/browse/games/release-date/new-releases/pc/date',
    async scraper(browser){ 
        let page = await browser.newPage();
        console.log(`Navigating to: ${this.url}`);
        await page.goto(this.url)


        let scrapedData = []

        async function scrapeCurrentPage() {
            await page.waitForSelector('.clamp-list')

            let titles = await page.$$eval('.clamp-list > tbody > tr > td > .title', text => text.textContent);
            console.log(titles)
        }
        
    }
}

module.exports = scraperObject;