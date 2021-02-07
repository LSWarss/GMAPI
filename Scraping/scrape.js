const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')




const uriPC = 'https://www.metacritic.com/browse/games/release-date/available/pc/date'
const uriPS5 = 'https://www.metacritic.com/browse/games/release-date/new-releases/ps5/date'

function scrapeGames(url, filename, $) {

    const writeStream = fs.createWriteStream(filename + '.csv', {flags: 'a'})

    // Write Headers
    writeStream.write('Title, Platform, Date \n');


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

function scrapAllPages(url, dataName) {

    let path = `.${dataName}.csv`
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }
    

    request(url, (error, response, html) => {
        if(!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            const lastPageNumber = $('.last_page').find('a').text()
            console.log(lastPageNumber);
            if(lastPageNumber === ''){
                scrapeGames(url, dataName, $);
            } else {
                for(let page = 0; page < parseInt(lastPageNumber); page++) {
                        if(page === 0) {
                            scrapeGames(url,dataName,$)
                        } else {
                            let scrapUrl = url + `?page=${page}`
                            scrapeGames(scrapUrl,dataName,$)
                        }
                }
            }
            
        }
    });
}


// scrapeGames(uriPS5, 'games_ps5.csv')

scrapAllPages(uriPS5, 'games_PS5')
scrapAllPages(uriPC, 'games_PC')
