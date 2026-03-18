const {DataTypes} = require('sequelize');
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
    },
    municipioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {msg: "Debes agregar un municipio"}
        }
    }
});

module.exports = Patrimonio;