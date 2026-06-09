const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

//Controller par la gestion de administradores(CRUD) para admin supremo
const listarAdmins = async (req, res) => {
    try {
        const admins = await Usuario.findAll({
            where: { rol: "admin" },
            attributes: { exclude: ["password"] }
        });
        return res.json(admins);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Usuario.findOne({
            where: { id, rol: "admin" },
            attributes: { exclude: ["password"] }
        });
        if (!admin) return res.status(404).json({ mensaje: "Admin no encontrado" });
        return res.json(admin);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const crearAdmin = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, telefono, email, password } = req.body;
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: "Faltan datos obligatorios (nombre, email, password)" });
        }
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) return res.status(400).json({ mensaje: "Email ya registrado" });

        const hashed = await bcrypt.hash(password, 10);
        const nuevo = await Usuario.create({
            nombre,
            apellido_paterno: apellido_paterno || '',
            apellido_materno: apellido_materno || '',
            telefono: telefono || '',
            email,
            password: hashed,
            rol: "admin"
        });
        return res.status(201).json({
            mensaje: "Admin creado",
            admin: {
                id: nuevo.id,
                nombre: nuevo.nombre,
                apellido_paterno: nuevo.apellido_paterno,
                apellido_materno: nuevo.apellido_materno,
                telefono: nuevo.telefono,
                email: nuevo.email,
                rol: nuevo.rol
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const editarAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido_paterno, apellido_materno, telefono, email, password } = req.body;
        const admin = await Usuario.findOne({ where: { id, rol: "admin" } });
        if (!admin) return res.status(404).json({ mensaje: "Admin no encontrado" });

        if (email && email !== admin.email) {
            const existe = await Usuario.findOne({ where: { email } });
            if (existe) return res.status(400).json({ mensaje: "Email ya en uso" });
            admin.email = email;
        }
        if (nombre) admin.nombre = nombre;
        if (apellido_paterno !== undefined) admin.apellido_paterno = apellido_paterno;
        if (apellido_materno !== undefined) admin.apellido_materno = apellido_materno;
        if (telefono !== undefined) admin.telefono = telefono;
        if (password) admin.password = await bcrypt.hash(password, 10);
        await admin.save();

        return res.json({
            mensaje: "Admin actualizado",
            admin: {
                id: admin.id,
                nombre: admin.nombre,
                apellido_paterno: admin.apellido_paterno,
                apellido_materno: admin.apellido_materno,
                telefono: admin.telefono,
                email: admin.email,
                rol: admin.rol
            }
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const eliminarAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Usuario.findOne({ where: { id, rol: "admin" } });
        if (!admin) return res.status(404).json({ mensaje: "Admin no encontrado" });
        await admin.destroy();
        return res.json({ mensaje: "Admin eliminado" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listarAdmins,
    getAdminById,
    crearAdmin,
    editarAdmin,
    eliminarAdmin
};