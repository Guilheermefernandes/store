const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Instances/mysql');

const TshirtData = sequelize.define('TshirtData', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    color: {
        type: DataTypes.INTEGER
    },
    size: {
        type: DataTypes.INTEGER
    },
    tshirt: {
        type: DataTypes.INTEGER
    },
    qtd: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'tshirt_data',
    timestamps: false
});

module.exports = TshirtData;