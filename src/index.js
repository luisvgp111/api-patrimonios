const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const Patrimonio = require("./models/Patrimonio");
const Municipio = require("./models/Municipio");

Municipio.hasMany(Patrimonio, { foreignKey: "municipioId", as: "patrimonios" });
Patrimonio.belongsTo(Municipio, { foreignKey: "municipioId", as: "municipio" });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log(`Rutas de admin listas en http://localhost:${PORT}`);
  });
});
