const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Credenciales incorrectas" });
        }
        const esValido = await bcrypt.compare(password, usuario.password);
        if (!esValido) {
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
            "PALABRA_CIFRADA",
            { expiresIn: "24h" }
        );

        return res.json({ token, nombre: usuario.nombre, rol: usuario.rol });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {  
    login
}