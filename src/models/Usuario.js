const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuario = sequelize.define("Usuario", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_paterno: {          
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''          
    },
    apellido_materno: {           
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    telefono: {                   
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''           
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('usuario', 'admin', 'admin_supremo'),
        allowNull: false,
        defaultValue: 'usuario'
    }
});

module.exports = Usuario;