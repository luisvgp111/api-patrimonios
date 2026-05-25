const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Link = sequelize.define('Link', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "El título del link es obligatorio" },
            notEmpty: { msg: "El título no puede estar vacío" }
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "La URL es obligatoria" },
            isUrl: { msg: "Debe ser una URL válida" }
        }
    },
    patrimonioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Patrimonios',
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true,
    tableName: 'Links'
});

module.exports = Link;