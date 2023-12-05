const dotenv = require('dotenv');

dotenv.config();

let db = {
    db: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT
}

if(process.env.NODE_ENV === 'test'){
    db = {
        db: process.env.TDD_MYSQL_DB,
        user: process.env.TDD_MYSQL_USER,
        password: process.env.TDD_MYSQL_PASSWORD,
        port: process.env.TDD_MYSQL_PORT
    }
}

module.exports = db;