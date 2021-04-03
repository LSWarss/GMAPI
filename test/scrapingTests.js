const { convertToPgDate, getUpcomingGamesUrlForPlatform, getYearGameReleasesUrl } = require("../Scraping/utilities")
var assert = require('assert')

describe('Utility', function() {
    describe('#convertToPgDate()', function() {
        it('should return date in format yyyy-mm-dd from Month Day, Year', function() {
            assert.strictEqual(convertToPgDate("February 21, 2021"), "2021-02-21");
        });
        it('should throw error when wrong month passed', function(){
            assert.throws(() => convertToPgDate("Tyłek 21, 2021"), Error, 'There is no such month ❌ : Tyłek')
        })
    });

    describe('#getUpcomingGamesUrlForPlatform', () => {
        it('should return valid url', () => {
            assert .strictEqual(getUpcomingGamesUrlForPlatform("pc"), 'https://www.metacritic.com/browse/games/release-date/coming-soon/pc/date')
            assert .strictEqual(getUpcomingGamesUrlForPlatform("ps5"), 'https://www.metacritic.com/browse/games/release-date/coming-soon/ps5/date')
            assert .strictEqual(getUpcomingGamesUrlForPlatform("xbox-series-x"), 'https://www.metacritic.com/browse/games/release-date/coming-soon/xbox-series-x/date')
        })
        it('should return valid link even if platform uppercase',() => {
            assert .strictEqual(getUpcomingGamesUrlForPlatform("PC"), 'https://www.metacritic.com/browse/games/release-date/coming-soon/pc/date')
        })
    })

    describe('#getYearGameReleasesUrl', () => {
        it('should return valid url', () => {
            assert .strictEqual(getYearGameReleasesUrl("pc", "2021"), 'https://www.metacritic.com/browse/games/score/metascore/year/pc/filtered?year_selected=2021&distribution=&sort=desc&view=detailed')
        })
        it('should throw an error on wrong date input', () => {
            assert.throws(() => {getYearGameReleasesUrl("pc", "2022")}, Error)
            assert.throws(() => {getYearGameReleasesUrl("pc", "1915")}, Error)
        
        })
    })
});
