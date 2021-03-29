const cron = require('node-cron')
const { scrapAllUrls } = require('./scrape')
const request = require('request')

console.log("Started cron")

cron.schedule('0 */6 * * *', function(){
    console.log("🤖 Running scrapping")
    scrapAllUrls()
});
