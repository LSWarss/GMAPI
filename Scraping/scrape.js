const request = require('request')
const cheerio = require('cheerio')
const {
    pool
} = require('../api/model/db')
const fs = require('fs')
const { convertToPgDate } = require('./utilities')

const metaUrls = {
    uriPC: 'https://www.metacritic.com/browse/games/release-date/available/pc/date',
    uriPS5: 'https://www.metacritic.com/browse/games/release-date/new-releases/ps5/date',
    uriPS4: 'https://www.metacritic.com/browse/games/release-date/available/ps4/date',
    uriXBSX: 'https://www.metacritic.com/browse/games/release-date/available/xbox-series-x/date',
    uriXBO: 'https://www.metacritic.com/browse/games/release-date/available/xboxone/date',
    uriSwitch: 'https://www.metacritic.com/browse/games/release-date/available/switch/date',
    uriIOS: 'https://www.metacritic.com/browse/games/release-date/available/ios/date',
    uriStadia: 'https://www.metacritic.com/browse/games/release-date/available/stadia/date'
}

function scrapeGames(url, writeStream) {

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
                    pool.query('SELECT * FROM games WHERE title = $1', [gameTitle], (error, results) => {
                        if (error) {
                            throw new Error(`Error on selecting from database occured ❌: ${error}`);
                        }  else { 
                            if(results && results.length) {
                                console.log('In database there is a game with such title, skipping ⏭')
                            } else {
                                pool.query('INSERT INTO games (title, platform, release_date) VALUES ($1,$2,$3)', [gameTitle,gamePlatform,convertToPgDate(gameRelease)], (error, results) => {
                                    if(error) { 
                                        throw new Error(`Error on inserting to database occured ❌: ${error}`);
                                    }
                                });
                            }
                        }
                    })

                    writeStream.write(`${gameTitle}, ${gamePlatform}, ${convertToPgDate(gameRelease)} \n`);

                    // console.log(`Game: ${gameTitle}, for ${gamePlatform}, realease at ${gameRelease}`)
                })
                console.log(`Scraping done for URL ✅: ${url}`);
            } else {
                setTimeout(scrapeGames(url, writeStream), 300)
            }
        } else {
            console.log(`There was an expected error ❌: ${error} and code: ${response.statusCode} on URL: ${url}`)
        } 
    })
}

function scrapAllPages(url, dataName) {

    let path = `.${dataName}.csv`
    if (fs.existsSync(path)) {
        fs.unlinkSync(path)
    }

    const writeStream = fs.createWriteStream(`${dataName}.csv`, {
        flags: 'a'
    })

    writeStream.on('error', function (err) {
        console.log(err);
    });

    // Write Headers
    writeStream.write('Title, Platform, Date \n');
    
    request(url, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const lastPageNumber = $('.last_page').find('a').text()
            console.log(lastPageNumber);


            if (lastPageNumber === '') {
                scrapeGames(url, writeStream);
            } else {
                for (let page = 0; page < parseInt(lastPageNumber); page++) {
                    if (page === 0) {
                        scrapeGames(url, writeStream)
                    } else {
                        let scrapUrl = url + `?page=${page}`
                        scrapeGames(scrapUrl, writeStream)
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
        scrapAllPages(metaUrls[key], `/Users/lukaszstachnik/ProjectSpace/GMAPI/scraping/scrapedData/${key}_games`)
    }
}

scrapAllUrls()

// scrapAllPages("https://www.metacritic.com/browse/games/release-date/new-releases/ps5/date", 'testing')

module.exports = {
    scrapAllPages
}