const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Patrimonio = sequelize.define('Patrimonio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM('Material', 'Inmaterial', 'Biocultural'),
        allowNull: false,
        defaultValue: 'Material'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imagen_url: {
        type: DataTypes.STRING
    },
    municipioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Debes agregar un municipio" }
        }
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'registrado'),
        defaultValue: 'pendiente',
        allowNull: false
    }
});

module.exports = Patrimonio;