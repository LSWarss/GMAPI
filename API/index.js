const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const controller = require('../API/controller/gamesController')
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ message: 'GMAPI - Gaming Premiers API'})
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT} ⛴`)
})

app.get('/games', controller.getGames)
app.get('/games/:id', controller.getGame)
app.post('/games', controller.createGame)
app.put('/games/:id', controller.updateGame)
app.delete('/games/:id', controller.deleteGame)

    