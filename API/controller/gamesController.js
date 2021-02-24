const { pool } = require('../model/db')

const getGames = (request, response) => {
    pool.query('SELECT * FROM games ORDER BY release_date ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getGamesByPlatform = (request,response) => {

    const platformName = request.params.name
    console.log(platformName)

    pool.query('SELECT * FROM games WHERE platform = $1', [platformName], (error,results) =>  {
    if(error) {
        throw error
    }
    response.status(200).json(results.rows)
    })
}

const getGame = (request, response) => {

    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM games WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createGame = (request, response) => {
    const { title, platform, release_date } = request.body

    pool.query('INSERT INTO games (title, platform, release_date) VALUES ($1,$2,$3)', [title,platform,release_date], (error, results) => {
        if(error) { 
            throw error
        }
        response.status(201).send(`Game ${title} added 🆕`)
    })
}

const updateGame = (request, response) => {
    const id = parseInt(request.params.id)
    const { title, platform, release_date } = request.body

    pool.query('UPDATE games SET title = $1, platform = $2, release_date = $3 WHERE id = $4', [title,platform,release_date, id], (error) => {
        if(error) { 
            throw error
        }
        response.status(200).send(`Game with ID: ${id} updated 🆙`)
    })
}

const deleteGame = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM games WHERE id = $1', [id], (error) => {
        if(error) { 
            throw error
        }
        response.status(200).send(`Game with ID: ${id} deleted 🆙`)
    })
}

module.exports = {
    getGame,
    getGames,
    getGamesByPlatform,
    createGame,
    updateGame,
    deleteGame
}

