const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const config = require('config')
const controller = require('../API/controller/gamesController')


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ message: 'GMAPI - Gaming Premiers API'})
})

const port = config.get('app.port')
app.listen(port, () => {
    console.log(`App running on port ${port} ⛴`)
})

app.get('/games', controller.getGames)
app.get('/games/:id', controller.getGame)
app.post('/games', controller.createGame)
app.put('/games/:id', controller.updateGame)
app.delete('/games/:id', controller.deleteGame)

