const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

/**
 * POST /contacto
 * Recibir solicitudes de contacto del formulario
 * Body: { nombre, correo, telefono, mensaje }
 */
router.post('/contacto', contactController.procesarContacto);

module.exports = router;
