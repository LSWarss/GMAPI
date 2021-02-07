const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')




const uriPC = 'https://www.metacritic.com/browse/games/release-date/new-releases/pc/date'
const uriPS5 = 'https://www.metacritic.com/browse/games/release-date/new-releases/ps5/date'

function scrapeGames(url, filename, $) {

    const writeStream = fs.createWriteStream(filename + '.csv', {flags: 'a'})

    // Write Headers
    writeStream.write('Title, Platform, Date \n');


    request(url, (error, response, html) => {

        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            // const gameContent = $('.clamp-summary-wrap');
            // // console.log(gameContent.html());
            // const title = gameContent.find('h3').parent().text()
            // console.log(title)

            $('.clamp-summary-wrap').each((i, el) => {
                const gameTitle = $(el).find('h3').first().text()
                const gameDetails = $(el).find('.clamp-details')
                const gamePlatform = gameDetails.find('span').next('span').text().replace(/\s\s+/g, '')
                const gameRelease = gameDetails.find('span').last().text().replace(/\s\s+/g, '')

                // Write row to CSV
                writeStream.write(`${gameTitle}, ${gamePlatform}, ${gameRelease} \n`);

                // console.log(`Game: ${gameTitle}, for ${gamePlatform}, realease at ${gameRelease}`)
            })

            console.log('Scraping done 🤖');
        }
    });
}

function scrapAllPages(url, dataName){
    request(url, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            const lastPageNumber = $('.last_page').find('a').text()
            console.log(lastPageNumber);

            scrapeGames(url, dataName, $);

        }
    });


}


// scrapeGames(uriPS5, 'games_ps5.csv')

scrapAllPages(uriPC, 'games_PC')
