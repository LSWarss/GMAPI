const cron = require('node-cron')
const { scraper } = require('./Cheerio/scrape')

console.log("Started cron")

cron.schedule('0 */6 * * *', function(){
    console.log("🤖 Running scrapping")
    scraper()
});
