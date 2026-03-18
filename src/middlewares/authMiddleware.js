const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({mensaje: "Acceso denegado. No hay token."})
    }

    try{
        const cifrado = jwt.verify(token, "PALABRA_CLAVE");
        req.usuario = cifrado;
        next();
    } catch (error) {
        res.status(400).json({mensaje: "Token no válido"});
    }
};

module.exports = authMiddleware;