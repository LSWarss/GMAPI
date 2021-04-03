const cron = require('node-cron')
const { scrapeComingSoonForAllSupportedPlatforms} = require('./Pupeeteer/metacritic')
console.log("Started cron")

cron.schedule('0 */6 * * *', function(){
    console.log("🤖 Running scrapping")
    scrapeComingSoonForAllSupportedPlatforms()
});
