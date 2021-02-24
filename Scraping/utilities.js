
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

module.exports = {
    convertToPgDate
}