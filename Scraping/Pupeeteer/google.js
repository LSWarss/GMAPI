const puppeteer = require('puppeteer')
const chalk = require("chalk")

const error = chalk.bold.red
const success = chalk.keyword("green")

async function run(){
    try {

        var browser = await puppeteer.launch({ headless : false})

        var page = await browser.newPage();

        await page.goto("https://www.google.com/");

        await page.screenshot({ path: "screenshot.png", fullPage: true});
        await browser.close();
        console.log(success("Screenshot made, browser closed"));
    } catch(err) { 
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"))
    }
}

run();