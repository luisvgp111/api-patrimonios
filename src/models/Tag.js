const {DataTypes} = require('sequelize');
const sequelize = require('../db');

const Tag = sequelize.define("Tag", {
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {timestamps: false});

module.exports = Tag;