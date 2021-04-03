
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

/**
 * Basic enum with utility componenets to parse urls from
 */
const MetaUrlComponents = Object.freeze({
    baseUrl: "https://www.metacritic.com/",
    comming_soon : "browse/games/release-date/coming-soon/",
    releases_score : "browse/games/score/metascore/year/"
    
})

/**
 * Function returning URL for upcoming games for given platform
 * @param {String} platform 
 * @returns {String} url
 */
function getUpcomingGamesUrlForPlatform(platform){ 
    return MetaUrlComponents["baseUrl"] + MetaUrlComponents["comming_soon"] + platform.toLowerCase() + "/date"
}

/**
 * Function returning URl for best games from given year and platform, check if the year is in the range of valid ones, if else throws an error. 
 * @param {String} platform 
 * @param {String} year 
 * @returns {String} url
 */
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