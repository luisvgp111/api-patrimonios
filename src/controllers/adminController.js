const { where, Op } = require("sequelize");
const { Patrimonio, Municipio, Tag, Ubicacion } = require("../models");
const path = require("path");
const ImagenPatrimonio = require("../models/ImagenPatrimonio");
const fs = require('fs/promises');   // Importa la versión con promesas
const fsSync = require('fs');   
const html_to_pdf = require("html-pdf-node");
const ExcelJS = require("exceljs");

// Crear patrimonio – siempre se crea con estado 'pendiente'
const createPatrimonio = async (req, res) => {
  try {
    let { tags, ubicaciones, ...datos } = req.body;

    // FORZAR estado a 'pendiente' (ignorar lo que venga en la petición)
    datos.estado = 'pendiente';

    // Manejo de portada
    if (req.files && req.files["portada"]) {
      datos.imagen_url = `/uploads/patrimonios/${req.files["portada"][0].filename}`;
    }

    const nuevo = await Patrimonio.create(datos);

    // Ubicaciones (igual que antes)
    if (ubicaciones) {
      const ubicacionesData = typeof ubicaciones === "string" ? JSON.parse(ubicaciones) : ubicaciones;
      if (Array.isArray(ubicacionesData) && ubicacionesData.length > 0) {
        const ubicacionesParaGuardar = ubicacionesData.map((ubi, index) => ({
          nombre_punto: ubi.nombre_punto,
          latitud: ubi.latitud,
          longitud: ubi.longitud,
          patrimonioId: nuevo.id,
          es_principal: index === 0,
        }));
        await Ubicacion.bulkCreate(ubicacionesParaGuardar);
      }
    }

    // Galería
    if (req.files && req.files["imagenes"]) {
      const imagenesGaleria = req.files["imagenes"].map((file) => ({
        url: `/uploads/patrimonios/${file.filename}`,
        patrimonioId: nuevo.id,
      }));
      await ImagenPatrimonio.bulkCreate(imagenesGaleria);
    }

    // Tags
    if (tags) {
      if (typeof tags === "string") {
        tags = tags.split(",").map((t) => t.trim());
      } else if (Array.isArray(tags)) {
        tags = tags.flatMap((t) => (typeof t === "string" ? t.split(",") : t)).map((t) => t.trim());
      }
      if (tags.length > 0) {
        const instanciasTags = await Promise.all(
          tags.map((nombre) => Tag.findOrCreate({ where: { nombre: nombre.toLowerCase() } }))
        );
        await nuevo.setTags(instanciasTags.map((t) => t[0]));
      }
    }

    const resultado = await Patrimonio.findByPk(nuevo.id, {
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: ImagenPatrimonio, as: "galeria" },
        { model: Ubicacion, as: "ubicaciones", separate: true, order: [["es_principal", "DESC"], ["id", "ASC"]] }
      ]
    });

    return res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar patrimonio – solo admin_supremo puede modificar el estado
const updatePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    let body = req.body;
    if (body["0"] && typeof body["0"] === "object") body = body["0"];

    let { tags, eliminarImagenesIds, ubicaciones, ...datos } = body;

    const patrimonio = await Patrimonio.findByPk(id);
    if (!patrimonio) return res.status(404).json({ error: "Patrimonio no encontrado" });

    // ⚠️ CONTROL DE ESTADO: si el usuario NO es supremo, eliminar 'estado' del objeto datos
    if (req.usuario.rol !== 'admin_supremo') {
      delete datos.estado;
    }

    // Portada (igual)
    if (req.files && req.files["portada"]) {
      if (patrimonio.imagen_url) {
        const cleanPath = patrimonio.imagen_url.startsWith("/") ? patrimonio.imagen_url.substring(1) : patrimonio.imagen_url;
        const oldPath = path.resolve(process.cwd(), cleanPath);
        try {
          if (fsSync.existsSync(oldPath)) await fs.unlink(oldPath);
        } catch (err) { console.error("Error al borrar portada", err.message); }
      }
      datos.imagen_url = `/uploads/patrimonios/${req.files["portada"][0].filename}`;
    }

    // Eliminar imágenes de galería
    if (eliminarImagenesIds) {
      let idsABorrar = Array.isArray(eliminarImagenesIds) ? eliminarImagenesIds : eliminarImagenesIds.split(",").map(num => parseInt(num.trim()));
      const imagenesABorrar = await ImagenPatrimonio.findAll({ where: { id: idsABorrar, patrimonioId: id } });
      for (const img of imagenesABorrar) {
        const filePath = path.resolve(process.cwd(), img.url.startsWith("/") ? img.url.substring(1) : img.url);
        try { if (fsSync.existsSync(filePath)) await fs.unlink(filePath); } catch (err) { console.error("Error disco:", err.message); }
        await img.destroy();
      }
    }

    // Agregar nuevas imágenes a galería
    if (req.files && req.files["imagenes"]) {
      const nuevasFotos = req.files["imagenes"].map((file) => ({
        url: `/uploads/patrimonios/${file.filename}`,
        patrimonioId: id,
      }));
      await ImagenPatrimonio.bulkCreate(nuevasFotos);
    }

    // Manejo de tags
    let tagsEnviado = "tags" in body || "tags[]" in body;
    if (tagsEnviado) {
      let tagsArray = [];
      if (typeof tags === "string") {
        tagsArray = tags ? tags.split(",").map(t => t.trim()).filter(t => t) : [];
      } else if (Array.isArray(tags)) {
        tagsArray = tags.map(t => {
          if (typeof t === "string") return t.trim();
          if (t && typeof t === "object" && t.nombre) return t.nombre.trim();
          return null;
        }).filter(t => t);
      }
      const instanciasTags = await Promise.all(tagsArray.map(nombre => Tag.findOrCreate({ where: { nombre: String(nombre).toLowerCase() } })));
      await patrimonio.setTags(instanciasTags.map(t => t[0]));
    }

    // Limpiar campos que no deben actualizarse directamente
    const camposABorrar = ["municipio", "tags", "galeria", "ubicaciones", "createdAt", "updatedAt"];
    camposABorrar.forEach(campo => delete datos[campo]);

    await patrimonio.update(datos);

    // Manejo de ubicaciones
    if (ubicaciones) {
      const uData = typeof ubicaciones === "string" ? JSON.parse(ubicaciones) : ubicaciones;
      if (Array.isArray(uData)) {
        await Ubicacion.destroy({ where: { patrimonioId: id } });
        const nuevasUbicaciones = uData.map((ubi, index) => ({
          nombre_punto: ubi.nombre_punto,
          latitud: ubi.latitud,
          longitud: ubi.longitud,
          patrimonioId: id,
          es_principal: index === 0,
        }));
        await Ubicacion.bulkCreate(nuevasUbicaciones);
      }
    }

    const resultado = await Patrimonio.findByPk(id, {
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: ImagenPatrimonio, as: "galeria" },
        { model: Ubicacion, as: "ubicaciones", separate: true, order: [["es_principal", "DESC"]] }
      ]
    });

    return res.json(resultado);
  } catch (error) {
    console.error("Error en updatePatrimonio", error);
    return res.status(500).json({ error: error.message });
  }
};

// Eliminar patrimonio (sin cambios)
const deletePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const borrado = await Patrimonio.destroy({ where: { id } });
    if (borrado) return res.status(200).json({ message: "Patrimonio eliminado" });
    else res.status(404).json({ error: "No se encontró el registro" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔁 OBTENER TODOS LOS PATRIMONIOS (para dashboard/admin) – incluye pendientes y registrados
const getAllPatrimoniosAdmin = async (req, res) => {
  try {
    const patrimonios = await Patrimonio.findAll({
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: ImagenPatrimonio, as: "galeria" },
        { model: Ubicacion, as: "ubicaciones" }
      ],
      order: [["nombre", "ASC"]]
    });
    return res.status(200).json(patrimonios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ CAMBIAR ESTADO DE UN PATRIMONIO (solo admin_supremo)
const cambiarEstadoPatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !['pendiente', 'registrado'].includes(estado)) {
      return res.status(400).json({ error: "Estado inválido. Debe ser 'pendiente' o 'registrado'" });
    }

    const patrimonio = await Patrimonio.findByPk(id);
    if (!patrimonio) return res.status(404).json({ error: "Patrimonio no encontrado" });

    patrimonio.estado = estado;
    await patrimonio.save();

    return res.json({ message: `Estado actualizado a '${estado}'`, patrimonio });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//    Endpoints de gestion, Tags (ADMINISTRADOR)

//Editar Tag
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre)
      return res.status(400).json({ error: "El nombre es requerido" });

    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).json({ error: "Tag no encontrado" });

    tag.nombre = nombre.trim().toLowerCase();
    await tag.save();

    return res.status(200).json({ mensaje: "Tag actualizado", tag });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Eliminar Tag
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag) {
      return res
        .status(400)
        .json({ error: "El tag ya no existe en la base de datos" });
    }

    await tag.destroy();

    return res.status(200).json({
      mensaje: `Tag '${tag.nombre}' eliminado globalmente con éxito.`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar Tag: " + error.message });
  }
};

//Exportar los patrimonios a excel
const exportarPatrimonios = async (req, res) => {
  try {
    const patrimonios = await Patrimonio.findAll({
      include: [
        { model: Ubicacion, as: "ubicaciones" },
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Patrimonios");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nombre", key: "nombre", width: 30 },
      { header: "Categoría", key: "categoria", width: 15 },
      { header: "Municipio", key: "municipio", width: 20 },
      { header: "Descripción", key: "descripcion", width: 50 },
      { header: "Tags", key: "tags", width: 30 },
      { header: "Longitud", key: "longitud", width: 30 },
      { header: "Latitud", key: "latitud", width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true };

    patrimonios.forEach((p) => {
      worksheet.addRow({
        id: p.id,
        nombre: p.nombre,
        categoria: p.categoria,
        municipio: p.municipio ? p.municipio.nombre : "N/A",
        descripcion: p.descripcion,
        tags: p.tags.map((t) => t.nombre).join(", "),
        longitud: p.longitud,
        latitud: p.latitud,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=patrimonios_sonora.xlsx",
    );

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  updateTag,
  deleteTag,
  createPatrimonio,
  updatePatrimonio,
  deletePatrimonio,
  exportarPatrimonios,
  getAllPatrimoniosAdmin,      
  cambiarEstadoPatrimonio      
};