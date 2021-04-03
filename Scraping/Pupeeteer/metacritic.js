const puppeteer = require("puppeteer")

const { performance } = require('perf_hooks');
const { colorLogs, getUpcomingGamesUrlForPlatform, convertToPgDate} = require('../utilities')
const { SupportedPlatforms } = require('../../API/model/constants/const') 
const {
    pool
} = require('../../API/model/db')

/**
 * Async function that scrapes games for a given URL
 * @param {String} url 
 */
async function scrapePage(url) { 
    try { 
        var t0 = performance.now()
        var browser = await puppeteer.launch({ headless: true})

        var page = await browser.newPage()

        await page.goto(url)

        await page.waitForSelector('table.clamp-list')

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
            var gameUrl = "https://www.metacritic.com" + game[1]["link"]
            await page.goto(gameUrl, {
                waitUntil: 'domcontentloaded',
                timeout: 0
            }).catch((error) => { 
                console.log(colorLogs.error(error))
             })
            console.log(colorLogs.successInside(`Successfully opened ${gameUrl}`))
            await page.waitForSelector('li.developer').catch((error) => {
                console.log(colorLogs.error(error))
            })

            game[1]["developer"] = (await page.evaluate(() => {
                
                var gameDeveloper = document.querySelector('li.developer > span.data').textContent.trim()
                return gameDeveloper
            }))

            game[1]["genres"] = (await page.evaluate(() => {
                var gameGenres = new Array()
                document.querySelectorAll('li.product_genre > span.data').forEach( element => {
                    gameGenres.push(element.textContent.trim().replace("'", ""))
                })
                return gameGenres
            }))
            
            console.log(game)
            await page.goBack();
        }

        await browser.close()

        games.forEach((game) => { 
            let queryText = `INSERT INTO games (title, description, developer, release_date, platform, score, genres) VALUES ($1,$2,$3,$4,$5,$6,ARRAY[${"'" + game.genres.join("','") + "'"}]) ON CONFLICT ON CONSTRAINT games_title_key DO NOTHING;`
            pool.query(queryText, [game.title,game.description, game.developer, convertToPgDate(game.releaseDate), game.platform, game.userScore], (error, results) => {
                if (error) {
                    throw new Error(`Error on inserting to database occured ❌: ${error}`);
                }
            });
        })


        var t1 = performance.now()
        console.log('Function: ' + colorLogs.functionCall(`scrapePage(${url})`) + " took approximately " + Math.round((t1 - t0)/1000) + " seconds.")
        console.log(colorLogs.success("Browser Closed"))
    } catch(err) { 
        console.log(colorLogs.error(err));
        await browser.close();
        console.log(colorLogs.error("Browser Closed"));
    }
}

/**
 * Async function returning array of URL with paging for future scraping on resolve
 * @param {String} baseUrl 
 * @returns [String]
 */
async function getAllPagesForScraping(baseUrl) {
    try { 
        var t0 = performance.now()
        var linksArray = []
        var browser = await puppeteer.launch({ headless: true})

        var page = await browser.newPage()

        await page.goto(baseUrl)
        
        var lastPageNumber = await page.evaluate(() =>  {
            if(document.querySelector('li.last_page') != null) {
                return document.querySelector('li.last_page').textContent.slice(1)
            } else {
                return 0
            }
        })

        if(lastPageNumber === 0) { 
            return [baseUrl]
        }
        browser.close();
        
        console.log(colorLogs.success("Page number gathering successfull"))
        var t1 = performance.now()
        console.log('Function: ' + colorLogs.functionCall("scrapePage()") + " took approximately " + Math.round((t1 - t0)/1000) + " seconds.")

        for(var i = 1; i < parseInt(lastPageNumber); i++) { 
            linksArray.push(baseUrl + "?page=" + i)
        }

        return linksArray
        
    } catch (err) { 
        console.log(colorLogs.error(err));
        await browser.close();
        console.log(colorLogs.error("Browser Closed"))
    }

}

function scrapeComingSoonForAllSupportedPlatforms() {
    for(let i=0; i <= SupportedPlatforms.length; i++){
        let timeoutLenght = i * 5 * 60 * 1000
        setTimeout( () =>   
        getAllPagesForScraping(getUpcomingGamesUrlForPlatform(SupportedPlatforms[i])).then((links) => {
            for (var link of links) {
                console.log("⛏ from " + colorLogs.functionCall(link))
                scrapePage(link)
            }
        } ), timeoutLenght)
    }
}

module.exports = {
    scrapeComingSoonForAllSupportedPlatforms
}


