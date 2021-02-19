const Pool = require('pg').Pool
const config = require('config')

const pool = new Pool({
    user: config.get('db.user'),
    host: config.get('db.host'),
    database: config.get('db.database'),
    password: config.get('db.password'),
    port: config.get('db.port')
})

module.exports = {
    pool
}