require('dotenv').config();
const nodemailer = require("nodemailer");

const validarCorreo = (correo) => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo);
};

const procesarContacto = async (req, res) => {
  try {
    const { nombre, correo, telefono, mensaje } = req.body;

    if (!mensaje || !mensaje.trim()) {
      return res.status(400).json({ ok: false, msg: 'El campo mensaje es obligatorio', campo: 'mensaje' });
    }
    if (mensaje.length > 5000) {
      return res.status(400).json({ ok: false, msg: 'El mensaje no puede exceder 5000 caracteres', campo: 'mensaje' });
    }
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({ ok: false, msg: 'Por favor ingresa tu nombre completo.', campo: 'nombre' });
    }
    if (nombre.length > 100) {
      return res.status(400).json({ ok: false, msg: 'El nombre no puede exceder 100 caracteres', campo: 'nombre' });
    }
    if (!correo || !correo.trim()) {
      return res.status(400).json({ ok: false, msg: 'Por favor ingresa tu correo electrónico.', campo: 'correo' });
    }
    if (!validarCorreo(correo.trim())) {
      return res.status(400).json({ ok: false, msg: 'El formato del correo no es válido', campo: 'correo' });
    }
    if (telefono && telefono.trim()) {
          const regexSoloNumeros = /^\d+$/;

          if (!regexSoloNumeros.test(telefono.trim())) {
            return res.status(400).json({ 
              ok: false, 
              msg: 'El campo teléfono solo debe contener números sin espacios ni símbolos.', 
              campo: 'telefono' 
            });
          }

          if (telefono.trim().length > 20) {
            return res.status(400).json({ 
              ok: false, 
              msg: 'El teléfono no puede exceder 20 caracteres', 
              campo: 'telefono' 
            });
          }
        }
        

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim();
    const telefonoLimpio = telefono ? telefono.trim() : "No proporcionado";
    const mensajeLimpio = mensaje.trim();
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: '"Patrimonio Sonorense"',  //Al lado de "Patrimonio sonorense, debe ir un correo. Ejem: '"Patrimonio Sonorense" <correo@gmail.com>'
      to: process.env.EMAIL_RECEIVER,
      replyTo: correoLimpio,
      subject: `Nueva sugerencia de: ${nombreLimpio}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #1a5f42;">Nueva sugerencia.</h2>
            <p><strong>Nombre:</strong> ${nombreLimpio}</p>
            <p><strong>Correo de contacto:</strong> ${correoLimpio}</p>
            <p><strong>Teléfono:</strong> ${telefonoLimpio}</p>
            <hr style="border:0; border-top: 1px solid #eee;" />
            <p><strong>Sugerencia aportada:</strong></p>  
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1a5f42;">
                ${mensajeLimpio.replace(/\n/g, "<br>")}
            </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      ok: true,
      msg: "Mensaje enviado correctamente. Gracias por tu sugerencia.",
    });

  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return res.status(500).json({
      ok: false,
      msg: "Ocurrió un error al procesar tu solicitud.",
      error: error.message
    });
  }
};

module.exports = {
  procesarContacto
};