const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Instances/mysql');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    lastName: {
        type: DataTypes.STRING
    },
    email: {
        unique: true,
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    neighborhood: {
        type: DataTypes.STRING
    },
    street: {
        type:DataTypes.STRING
    },
    number:{
        type: DataTypes.INTEGER
    },
    permission: {
        type: DataTypes.NUMBER
    }

}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;