const express = require("express");
const cors = require("cors");
const sequelize = require("./db");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/admin/patrimonios', adminRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor en puerto ${PORT}`);
        console.log(`Rutas de admin listas en http://localhost:${PORT}/api/admin/patrimonios`)
    });
});