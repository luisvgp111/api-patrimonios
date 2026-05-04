const { DataTypes, Model } = require("sequelize");
const sequelize = require("../db");

const Ubicacion = sequelize.define(
  "Ubicacion",
  {
    nombre_punto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    es_principal: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    patrimonioId:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
  },
  {
    tableName: "Ubicaciones",
    timestamps: false,
  },
);

module.exports = Ubicacion;
