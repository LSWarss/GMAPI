
const MonthsEnum = Object.freeze({
    "January": "01",
    "February": "02",
    "March": "03",
    "April": "04",
    "May": "05",
    "June": "06",
    "July": "07",
    "August": "08",
    "September": "09",
    "October": "10",
    "November": "11",
    "December": "12",
})

/**
 * Converts to date processable by postrgres query from scraped format
 * @param {String} date Input date in format: Month Day, Numeric Year
 * @returns {String} 
 */
function convertToPgDate(date){

    let convertedDate = date.replace(",", "").split(" ")
    if(convertedDate[0] in MonthsEnum){
        convertedDate[0] = MonthsEnum[convertedDate[0]]
    } else {
        throw Error(`There is no such month ❌ : ${convertedDate[0]}`)
    }
    return `${convertedDate[2]}-${convertedDate[0]}-${convertedDate[1]}`
}

const MetaUrls = { 
    Upcoming: {
            PC: 'https://www.metacritic.com/browse/games/release-date/coming-soon/pc/date',
            PS5: 'https://www.metacritic.com/browse/games/release-date/coming-soon/ps5/date',
            PS4: 'https://www.metacritic.com/browse/games/release-date/coming-soon/ps4/date',
            XBOXSX: 'https://www.metacritic.com/browse/games/release-date/coming-soon/xbox-series-x/date',
            XBOXO: 'https://www.metacritic.com/browse/games/release-date/coming-soon/xboxone/date',
            SWITCH: 'https://www.metacritic.com/browse/games/release-date/coming-soon/switch/date',
            IOS:'https://www.metacritic.com/browse/games/release-date/coming-soon/ios/date',
            STADIAL: 'https://www.metacritic.com/browse/games/release-date/coming-soon/stadia/date'
        },
    GameYearReleasesByScore: {
            PC: 'https://www.metacritic.com/browse/games/score/metascore/year/pc/filtered?year_selected=2021&distribution=&sort=desc&view=detailed',
            PS5: 'https://www.metacritic.com/browse/games/score/metascore/year/ps5/filtered?year_selected=2021&distribution=&sort=desc&view=detailed',
            PS4: 'https://www.metacritic.com/browse/games/score/metascore/year/ps4/filtered?year_selected=2021&distribution=&sort=desc&view=detailed',
            XBOXSX: 'https://www.metacritic.com/browse/games/score/metascore/year/xbox-series-x/filtered?year_selected=2021&view=detailed&sort=desc',
            XBOXO: 'https://www.metacritic.com/browse/games/score/metascore/year/xboxone/filtered?year_selected=2021&view=detailed&sort=desc',
            SWITCH: 'https://www.metacritic.com/browse/games/release-date/coming-soon/switch/date',
            IOS:'https://www.metacritic.com/browse/games/release-date/coming-soon/ios/date',
            STADIAL: 'https://www.metacritic.com/browse/games/release-date/coming-soon/stadia/date'
        },
}

const MetaUrlComponents = Object.freeze({
    baseUrl: "https://www.metacritic.com/",
    comming_soon : "browse/games/release-date/coming-soon/",
    releases_score : "browse/games/score/metascore/year/"
    
})

function getUpcomingGamesUrlForPlatform(platform){ 
    return MetaUrlComponents["baseUrl"] + MetaUrlComponents["comming_soon"] + platform.toLowerCase() + "/date"
}

function getYearGameReleasesUrl(platform, year){
    let currentYear = new Date();
    let yearParsed = Date.parse(`${year}-01-01`).toFixed()
    if (Date.parse(currentYear) < yearParsed || yearParsed < Date.parse("1916")) { 
        throw new Error("Wrong date passed")
    } else { 
    return MetaUrlComponents['baseUrl'] + MetaUrlComponents['releases_score'] + platform.toLowerCase() + `/filtered?year_selected=${year}` + "&distribution=&sort=desc&view=detailed"
    }
}

module.exports = {
    convertToPgDate,
    getUpcomingGamesUrlForPlatform,
    getYearGameReleasesUrl
}