
const isAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: "No autenticado" });
    }
    if (req.usuario.rol === 'admin' || req.usuario.rol === 'admin_supremo') {
        return next();
    }
    return res.status(403).json({ mensaje: "Acceso denegado. Se necesitan permisos de administrador." });
};

const isSupremo = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: "No autenticado" });
    }
    if (req.usuario.rol === 'admin_supremo') {
        return next();
    }
    return res.status(403).json({ mensaje: "Acceso denegado. Solo el administrador supremo puede realizar esta acción." });
};

module.exports = { isAdmin, isSupremo };