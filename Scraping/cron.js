const cron = require('node-cron')
const { scrapAllUrls } = require('./scrape')
const request = require('request')

console.log("Started cron")

cron.schedule('0 */6 * * *', function(){
    console.log("🤖 Running scrapping")
    scrapAllUrls()
});

cron.schedule('*/5 * * * *', function(){
    console.log("A five minute cron job for testing etc: ✔️")
    request('https://api.chucknorris.io/jokes/random', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.value);
    });
})
