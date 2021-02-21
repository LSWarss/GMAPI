const Pool = require('pg').Pool
let pool = new Pool()

if (process.env.DATABASE_URL) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
            });
} else {
    pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: process.env.DATABASE_PASSWORD,
            port: 5432
        })
}

pool.connect()


module.exports = {
    pool
}