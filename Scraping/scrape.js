const request = require('request')
const cheerio = require('cheerio')


const {
    pool
} = require('../API/model/db')


const {
    convertToPgDate
} = require('./utilities')


const metaUrls = {
    uriPC: 'https://www.metacritic.com/browse/games/release-date/coming-soon/pc/date',
    uriPS5: 'https://www.metacritic.com/browse/games/release-date/coming-soon/ps5/date',
    uriPS4: 'https://www.metacritic.com/browse/games/release-date/coming-soon/ps4/date',
    uriXBSX: 'https://www.metacritic.com/browse/games/release-date/coming-soon/xbox-series-x/date',
    uriXBO: 'https://www.metacritic.com/browse/games/release-date/coming-soon/xboxone/date',
    uriSwitch: 'https://www.metacritic.com/browse/games/release-date/coming-soon/switch/date',
    uriIOS: 'https://www.metacritic.com/browse/games/release-date/coming-soon/ios/date',
    uriStadia: 'https://www.metacritic.com/browse/games/release-date/coming-soon/stadia/date'
}

function scrapeGames(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {

                    const $ = cheerio.load(html);

                    if ($.length) {
                        $('.clamp-summary-wrap').each((i, el) => {
                            const gameTitle = $(el).find('h3').first().text()
                            const gameDetails = $(el).find('.clamp-details')
                            const gamePlatform = gameDetails.find('span').next('span').text().replace(/\s\s+/g, '')
                            const gameRelease = gameDetails.find('span').last().text().replace(/\s\s+/g, '')

                            // Write row to CSV
                            pool.query('INSERT INTO games (title, platform, release_date) VALUES ($1,$2,$3) ON CONFLICT ON CONSTRAINT games_title_key DO NOTHING;', [gameTitle, gamePlatform, convertToPgDate(gameRelease)], (error, results) => {
                                if (error) {
                                    throw new Error(`Error on inserting to database occured ❌: ${error}`);
                                }
                            });
                        })
                        console.log(`Scraping done for URL ✅: ${url}`);
                        resolve();
                    } else {
                        reject(`There was an expected error ❌: ${error} and code: ${response.statusCode} on URL: ${url}`)
                    }
                }
            })
        }, 5000)
    })
}

function scrapGamesWithExtras(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    let $ = cheerio.load(html)

                    if ($.length) {
                        $('.clamp-summary-wrap').each((i, el) => {
                            const gameTitle = $(el).find('h3').first().text()
                            const gameLink = $(el).find('a.title').first().attr('href')
                            const gameDetails = $(el).find('.clamp-details')
                            const gamePlatform = gameDetails.find('span').next('span').text().replace(/\s\s+/g, '')
                            const gameRelease = gameDetails.find('span').last().text().replace(/\s\s+/g, '')
                            const gameSummary = $(el).find('div.summary').first().text().replace(/\s\s+/g, '')
                            const gameScoreDiv = $(el).find('div.clamp-userscore')
                            const gameScore = gameScoreDiv.find('a').children().first().text() 
    
                            // Write row to database
                            pool.query('INSERT INTO games (title, description, developer, genre, release_date, platform, score) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT ON CONSTRAINT games_title_key DO NOTHING;', [gameTitle,gameSummary, gameDeveloper, gameGenre, convertToPgDate(gameRelease), gamePlatform, gameScore], (error, results) => {
                                if (error) {
                                    throw new Error(`Error on inserting to database occured ❌: ${error}`);
                                }
                            });
                        })
                        console.log(`Scraping done for URL ✅: ${url}`);
                        resolve();
                    } else {
                        reject(`There was an expected error ❌: ${error} and code: ${response.statusCode} on URL: ${url}`)
                    }
                }
            })
        }, 10000)
    })
}

function scrapGameDetails(url) { 
    return new Promise((resolve, reject) => {
            request(url, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    let $ = cheerio.load(html)
                    let gameGenre = ""
                    let gameDeveloper = ""

                    if ($.length) { 
                        
                        
                        $('div.side_details').each((i, el) => {
                            const gameDeveloperLi = $(el).find('li.developer')
                            gameDeveloper = gameDeveloperLi.find('span.data').text().replace(/\s\s+/g, '')
                            const gameGenreLi = $(el).find('li.product_genre')
                            gameGenre = gameGenreLi.find('span.data').first().text()
                        })
                    }    
                    resolve([gameGenre, gameDeveloper])
                } else {
                    reject(`There was an expected error ❌: ${error} and code: ${response.statusCode} on URL: ${url}`)
                }
            })
    })
}

async function scrapAllPages(url) {

    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const lastPageNumber = $('.last_page').find('a').text()
            console.log(`Last page numer for url: ${url}, is: ${lastPageNumber}`);


            if (lastPageNumber === '') {
                scrapeGames(url);
            } else {
                for (let page = 0; page < parseInt(lastPageNumber); page++) {
                    if (page === 0) {
                        scrapeGames(url)
                    } else {
                        let scrapUrl = url + `?page=${page}`
                        scrapeGames(scrapUrl)
                    }
                }
            }

        } else {
            console.log(`There was an expected error ❌: ${error}`)
        }


    });
}




function scrapAllUrls() {
    for (const key in metaUrls) {
        console.log(metaUrls[key])
        scrapAllPages(metaUrls[key])
    }
}

scrapGamesWithExtras("https://www.metacritic.com/browse/games/release-date/new-releases/ps5/date")

module.exports = {
    scrapAllUrls
}