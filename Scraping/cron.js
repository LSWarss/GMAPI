const cron = require('node-cron')
const { scraper } = require('./scrape')

console.log("Started cron")

cron.schedule('0 */6 * * *', function(){
    console.log("🤖 Running scrapping")
    scraper()
});
