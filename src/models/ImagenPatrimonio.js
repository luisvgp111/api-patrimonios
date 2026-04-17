const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const ImagenPatrimonio = sequelize.define('ImagenPatrimonio', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'ImagenesPatrimonio'
});

module.exports = ImagenPatrimonio;