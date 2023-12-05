const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Instances/mysql');

const Size = sequelize.define('Size', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    size: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'tshirt_size',
    timestamps: false
});

module.exports = Size;