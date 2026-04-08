const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Municipio = sequelize.define('Municipio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    latitud: {
        type: DataTypes.DECIMAL(10,8),
        allowNull: true
    },
    longitud: {
        type: DataTypes.DECIMAL(11,8),
        allowNull: true
    }
}, {timestamps: false});

module.exports = Municipio;