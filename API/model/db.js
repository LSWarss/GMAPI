const Pool = require('pg').Pool

// const pool = new Pool({
//     user: config.get('db.user'),
//     host: config.get('db.host'),
//     database: config.get('db.database'),
//     password: config.get('db.password'),
//     port: config.get('db.port')
// })

const pool = new Pool({
   connectionString: process.env.DATABASE_URL,
   ssl: {
       rejectUnauthorized: false
   }
});

pool.connect()


module.exports = {
    pool
}