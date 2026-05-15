// seedAdmin.js
const bcrypt = require('bcryptjs');
const sequelize = require('./src/db');     // Ajusta la ruta según tu estructura
const Usuario = require('./src/models/Usuario');

async function crearAdminSupremo() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('Conectado a PostgreSQL');

    // Verificar si ya existe un admin_supremo
    const existe = await Usuario.findOne({ where: { rol: 'admin_supremo' } });
    if (existe) {
      console.log('Ya existe un administrador supremo:', existe.email);
      process.exit(0);
    }

    // Datos del super admin (actualizados con los nuevos campos)
    const nombre = 'Waos';
    const apellido_paterno = 'Admin';     
    const apellido_materno = 'Supremo';
    const telefono = '6442112233';           
    const email = 'admin@supremo.com';
    const password = 'admin123';  
    const rol = 'admin_supremo';

    // Hashear contraseña (más sencillo)
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario con todos los campos
    const nuevo = await Usuario.create({
      nombre,
      apellido_paterno,
      apellido_materno,
      telefono,
      email,
      password: passwordHash,
      rol
    });

    console.log(`✅ Administrador supremo creado:
    ID: ${nuevo.id}
    Nombre: ${nuevo.nombre} ${nuevo.apellido_paterno} ${nuevo.apellido_materno}
    Email: ${nuevo.email}
    Teléfono: ${nuevo.telefono || 'No especificado'}
    Rol: ${nuevo.rol}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear admin supremo:', error);
    process.exit(1);
  }
}

crearAdminSupremo();