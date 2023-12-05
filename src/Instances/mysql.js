const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const db = require('./database');

dotenv.config();

const sequelize = new Sequelize(
    db.db ,
    db.user,
    db.password,
    {
        dialect: 'mysql',
        port: parseInt(db.port)
    }
);

module.exports = sequelize;