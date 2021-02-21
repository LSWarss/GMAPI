const { convertToPgDate } = require("../scraping/utilities")
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
});