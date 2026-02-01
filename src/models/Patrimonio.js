const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Patrimonio = sequelize.define('Patrimonio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    latitud: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    longitud: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    imagen_url: {
        type: DataTypes.STRING
    }
});

module.exports = Patrimonio;