const { Resend } = require('resend');
// Inicializar cliente de Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Enviar correo de contacto mediante Resend
 * @param {Object} datos - Datos del formulario de contacto
 * @param {string} datos.nombre - Nombre del remitente (opcional)
 * @param {string} datos.correo - Correo del remitente (opcional)
 * @param {string} datos.telefono - Teléfono del remitente (opcional)
 * @param {string} datos.mensaje - Mensaje de contacto (obligatorio)
 * @returns {Promise<Object>} Respuesta del envío
 */
const enviarCorreoContacto = async (datos) => {
  const { nombre, correo, telefono, mensaje } = datos;

  const cuerpoCorreo = `Nombre: ${nombre || 'No proporcionado'}
Correo: ${correo || 'No proporcionado'}
Teléfono: ${telefono || 'No proporcionado'}

Mensaje:
${mensaje}`;

  const cuerpoHTML = `
    <p><strong>Nombre:</strong> ${nombre || 'No proporcionado'}</p>
    <p><strong>Correo:</strong> ${correo || 'No proporcionado'}</p>
    <p><strong>Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
    <h3>Mensaje:</h3>
    <p>${mensaje.replace(/\n/g, '<br>')}</p>
  `;

  try {
    const resultado = await resend.emails.send({
      from: 'Patrimonio Sonorense <onboarding@resend.dev>',
      to: process.env.CORREO_DESTINATARIO,
      subject: 'Nueva sugerencia recibida',
      html: cuerpoHTML,
      text: cuerpoCorreo,
      reply_to: correo || undefined
    });

    if (resultado.error) {
      console.error('Error de Resend:', resultado.error);
      return {
        exitoso: false,
        mensaje: 'Error al enviar el correo',
        error: resultado.error.message
      };
    }

    return {
      exitoso: true,
      mensaje: 'Correo enviado exitosamente',
      id: resultado.data.id
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return {
      exitoso: false,
      mensaje: 'Error al enviar el correo',
      error: error.message
    };
  }
};

module.exports = {
  enviarCorreoContacto
};
