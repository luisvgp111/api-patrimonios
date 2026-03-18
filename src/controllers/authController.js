const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Registrar administradores
const registrar = async (req, res) => {
    try{
        const {nombre, email, password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        const nuevoUsurio = await Usuario.create({
            nombre,
            email,
            password: passwordHashed
        });

        return res.status(201).json({mensaje: "Admin registrado con exito"});
    } catch (error) {
        res.status(400).json({ error: "El email ya existe o los datos son invalidos"});
    }
};

//Inicio de sesion con credenciales existentes
const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        const usuario = await Usuario.findOne({where: {email}});
        if (!usuario){
            return res.status(404).json({mensaje: "Credenciales incorrectas"});
        }

        const esValido = await bcrypt.compare(password, usuario.password);
        if(!esValido) {
            return res.status(401).json({mensaje: "Credenciales incorrectas"});
        }

        const token = jwt.sign(
            {id: usuario.id, nombre: usuario.nombre},
            "PALABRA_CLAVE",
            {expiresIn:"24h"}
        );
        
        return res.json({token, nombre: usuario.nombre});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}

module.exports = {
    registrar,
    login
}