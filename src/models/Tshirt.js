const { Model, DataTypes } = require('sequelize');
const sequelize = require('../Instances/mysql');

const Tshirt = sequelize.define('Tshirt', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.NUMBER
    },
    collection: {
        unique: true,
        type: DataTypes.STRING
    },
    describe_tshirt: {
        type: DataTypes.STRING
    },
    discount: {
        type: DataTypes.NUMBER
    }
}, {
    tableName: 'tshirt',
    timestamps: false
});

module.exports = Tshirt;