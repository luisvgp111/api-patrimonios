const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const path = require("path")

//const {Patrimonio, Municipio, Tag, Usuario} = require('./models')

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", publicRoutes)

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log(`Rutas de admin listas en http://localhost:${PORT}`);
  });
});
