const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Municipio = sequelize.define('Municipio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {timestamps: false});

module.exports = Municipio;