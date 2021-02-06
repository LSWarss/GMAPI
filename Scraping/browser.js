const puppeteer = require('puppeteer')

async function startBrowser() { 
    let browser;
    try {
        console.log("[browser.js] - Opening the browser...");
        browser = await puppeteer.launch( {
            headless: false, //TODO: Change this to true for deployment
            args: ['--disable-setuid-sandbox'],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

module.exports = {
    startBrowser
};