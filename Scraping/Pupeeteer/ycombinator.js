const puppeteer = require("puppeteer")
const chalk = require("chalk")
const fs = require('fs');

const error = chalk.bold.red
const success = chalk.keyword("green")
const successInside = chalk.keyword("blue")

async function run() { 
    try {
        // open the headless browser
        var browser = await puppeteer.launch({ headless: true });
        // open a new page
        var page = await browser.newPage();
        // enter url in page
        await page.goto(`https://news.ycombinator.com/`);
        
        await page.waitForSelector("a.storylink");
        var news = await page.evaluate(() => {
          
          var scoreList = document.querySelectorAll(`span.score`)
          var titleNodeList = document.querySelectorAll(`a.storylink`);
          var ageList = document.querySelectorAll(`span.age`);
         
          var titleLinkArray = [];
          for (var i = 0; i < titleNodeList.length; i++) {
            titleLinkArray[i] = {
              title: titleNodeList[i].innerText.trim(),
              link: titleNodeList[i].getAttribute("href"),
              age: ageList[i].innerText.trim(),
              score: scoreList[i]
            };
          }
          return titleLinkArray;
        });
        // console.log(news);
        await browser.close();
        // Writing the news inside a json file
        fs.writeFile("hackernews.json", JSON.stringify(news), function(err) {
          if (err) throw err;
          console.log("Saved!");
        });
        console.log(success("Browser Closed"));
      } catch (err) {
        // Catch and display errors
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"));
      }
}

run();