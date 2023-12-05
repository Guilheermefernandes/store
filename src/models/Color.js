const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Instances/mysql');

const Color = sequelize.define('Color', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    hexa_decimal: {
        type: DataTypes.STRING
    },
    name_color: {
        type: DataTypes.STRING
    },
}, {
    tableName: 'tshirt_color',
    timestamps: false
});

module.exports = Color;