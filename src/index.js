const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supremoRoutes = require('./routes/supremoRoutes');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const path = require("path")
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
//const {Patrimonio, Municipio, Tag, Usuario} = require('./models')
const app = express();

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  skip: (req) => req.method === 'OPTIONS', 
  message: "Demasiadas peticiones desde esta IP, por favor intenta después de 15 minutos",
  standardHeaders: true, 
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10, 
  message: "Demasiados intentos de inicio de sesión, cuenta bloqueada temporalmente",
});

app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false, 
}));
// app.use(generalLimiter);
app.use(express.json());

app.use('/api', publicRoutes);        
app.use('/api/admin', adminRoutes);   
app.use('/api/supremo', supremoRoutes); 
app.use('/api/auth', authRoutes);  
app.use('/api', contactRoutes);  

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
    console.log(`Rutas de admin listas en http://localhost:${PORT}`);
  });
});
