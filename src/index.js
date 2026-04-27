const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const path = require("path")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//const {Patrimonio, Municipio, Tag, Usuario} = require('./models')
const app = express();

//Limitador de peticiones por IP
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Demasiadas peticiones desde esta IP, por favor intenta después de 15 minutos",
  standardHeaders: true, 
  legacyHeaders: false,
});
//Limitador de peticiones para el Login
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: "Demasiados intentos de inicio de sesión, cuenta bloqueada temporalmente",
});

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, 
}));
app.use(generalLimiter);
app.use(cors());
app.use(express.json());

app.use("/api/auth", loginLimiter, authRoutes);
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
