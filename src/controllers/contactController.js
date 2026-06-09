const { enviarCorreoContacto } = require('../services/emailService');

//Controller de contacto para el formulario de contacto en la página pública.
/**
 * Validar que el correo tenga un formato válido
 * @param {string} correo
 * @returns {boolean}
 */
const validarCorreo = (correo) => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo);
};

/**
 * Enviar formulario de contacto
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 */
const enviarContacto = async (req, res) => {
  try {
    const { nombre, correo, telefono, mensaje } = req.body;

    // Validación: mensaje obligatorio
    if (!mensaje || !mensaje.trim()) {
      return res.status(400).json({
        error: 'El campo mensaje es obligatorio',
        campo: 'mensaje'
      });
    }

    // Validación de longitud del mensaje
    if (mensaje.length > 5000) {
      return res.status(400).json({
        error: 'El mensaje no puede exceder 5000 caracteres',
        campo: 'mensaje'
      });
    }

    // Validación de correo si se proporciona
    if (correo && correo.trim()) {
      if (!validarCorreo(correo)) {
        return res.status(400).json({
          error: 'El formato del correo no es válido',
          campo: 'correo'
        });
      }
    }

    // Validación de longitud para nombre si se proporciona
    if (nombre && nombre.length > 100) {
      return res.status(400).json({
        error: 'El nombre no puede exceder 100 caracteres',
        campo: 'nombre'
      });
    }

    // Validación de longitud para teléfono si se proporciona
    if (telefono && telefono.length > 20) {
      return res.status(400).json({
        error: 'El teléfono no puede exceder 20 caracteres',
        campo: 'telefono'
      });
    }

    // Preparar datos para enviar correo
    const datosContacto = {
      nombre: nombre ? nombre.trim() : '',
      correo: correo ? correo.trim() : '',
      telefono: telefono ? telefono.trim() : '',
      mensaje: mensaje.trim()
    };

    // Enviar correo
    const resultado = await enviarCorreoContacto(datosContacto);

    if (!resultado.exitoso) {
      return res.status(500).json({
        error: 'No fue posible procesar tu solicitud en este momento. Por favor, intenta más tarde.'
      });
    }

    // Respuesta exitosa
    return res.status(200).json({
      mensaje: 'Tu solicitud ha sido recibida. Nos pondremos en contacto pronto.',
      id: resultado.id
    });

  } catch (error) {
    console.error('Error en enviarContacto:', error);
    return res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
};

module.exports = {
  enviarContacto
};
