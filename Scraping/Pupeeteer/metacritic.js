const puppeteer = require("puppeteer")
const chalk = require("chalk")
const fs = require('fs');
const { performance } = require('perf_hooks');

const error = chalk.bold.red
const success = chalk.keyword("green")
const successInside = chalk.keyword("blue")
const functionCall = chalk.bold.cyan

async function scrapePage(url) { 
    try { 
        var t0 = performance.now()
        var browser = await puppeteer.launch({ headless: true})

        var page = await browser.newPage()

        await page.goto(url)

        await page.waitForSelector('table.clamp-list')
        await page.waitForSelector('ul.pages')
        var lastPageNumber = await page.evaluate(() => document.querySelector('li.last_page').textContent.slice(1))
        console.log(lastPageNumber)

        var games = await page.evaluate(() => { 
            
            var gamesTitles = document.querySelectorAll('a.title')
            var gamesSummarys = document.querySelectorAll('div.summary')
            var gamesPlatforms = document.querySelectorAll('div.platform > span.data')
            var gamesReleaseDates = document.querySelectorAll('div.clamp-details > span')
            var gamesUserScore = document.querySelectorAll('div.clamp-userscore > a')
            var gamesArray = []

            for(var i = 0; i < gamesTitles.length; i++) {

                gamesArray[i] = {
                    title: gamesTitles[i].innerText.trim(),
                    link: gamesTitles[i].getAttribute("href"),
                    description: gamesSummarys[i].innerText.trim(),
                    platform: gamesPlatforms[i].innerText.trim(),
                    releaseDate: gamesReleaseDates[i].innerText.trim(),
                    userScore: gamesUserScore[i].textContent.trim()
                }
            }

            return gamesArray
        })

        for (var game of games.entries()) {
            var gameUrl = "https://www.metacritic.com/" + game[1]["link"]
            await page.goto(gameUrl)
            console.log(successInside(`Successfully opened ${gameUrl}`))
            await page.waitForSelector('li.developer')

            game[1]["developer"] = (await page.evaluate(() => {
                
                var gameDeveloper = document.querySelector('li.developer > span.data').textContent.trim()
                return gameDeveloper
            }))

            game[1]["genres"] = (await page.evaluate(() => {
                var gameGenres = new Array()
                document.querySelectorAll('li.product_genre > span.data').forEach( element => { 
                    gameGenres.push(element.textContent)
                })
                return gameGenres
            }))
            
            console.log(game)
            await page.goBack();
        }

        await browser.close()

        fs.writeFile("games.json", JSON.stringify(games), (err) => {
            if(err) throw err;
            console.log(successInside("Saved games!"))
        })
        var t1 = performance.now()
        console.log('Function: ' + functionCall("scrapePage()") + " took approximately " + Math.round((t1 - t0)/1000) + " seconds.")
        console.log(success("Browser Closed"))
    } catch(err) { 
        console.log(error(err));
        await browser.close();
        console.log(error("Browser Closed"));
    }
}

scrapePage('https://www.metacritic.com/browse/games/score/metascore/year/all/filtered')