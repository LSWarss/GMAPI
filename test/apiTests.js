const gamesRouter = require('../API/routes/games')

const request = require('supertest')
const express = require('express')
const app = express();

app.use(express.urlencoded({extended: false}))
app.use('/games', gamesRouter)

describe("GET /games", () => {
    it('responds with json', (done) => {
    request(app)
        .get('/games')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200,done)
})
})
