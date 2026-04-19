const { where, Op } = require("sequelize");
const { Patrimonio, Municipio, Tag} = require("../models");
const path = require("path");
const ImagenPatrimonio = require("../models/ImagenPatrimonio");
const fs = require("fs").promises; // o fs.promises
const ExcelJS = require('exceljs');

//    Endpoints de gestion, patrimonios (ADMINISTRADOR)

//Crear un patrimonio
const createPatrimonio = async (req, res) => {
  try {
    let { tags, ...datos } = req.body;

    //Manejo de la portada (imagen_url)
    if (req.files && req.files["portada"]) {
      datos.imagen_url = `/uploads/patrimonios/${req.files["portada"][0].filename}`;
    }

    //Registro base del patrimonio
    const nuevo = await Patrimonio.create(datos);

    //Manejo de la galeria para poner varias imagenes
    if (req.files && req.files["imagenes"]) {
      const imagenesGaleria = req.files["imagenes"].map((file) => ({
        url: `/uploads/patrimonios/${file.filename}`,
        patrimonioId: nuevo.id,
      }));
      await ImagenPatrimonio.bulkCreate(imagenesGaleria);
    }

    //Logica de los tags
    if (tags) {
      // Normalización
      if (typeof tags === "string") {
        tags = tags.split(",").map((t) => t.trim());
      } else if (Array.isArray(tags)) {
        tags = tags
          .flatMap((t) => (typeof t === "string" ? t.split(",") : t))
          .map((t) => t.trim());
      }

      if (tags.length > 0) {
        const instanciasTags = await Promise.all(
          tags.map((nombre) =>
            Tag.findOrCreate({
              where: { nombre: nombre.toLowerCase() },
            }),
          ),
        );
        await nuevo.setTags(instanciasTags.map((t) => t[0]));
      }
    }

    const resultado = await Patrimonio.findByPk(nuevo.id, {
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: ImagenPatrimonio, as: "galeria" },
      ],
    });

    return res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un patrimonio (CON manejo de imagen) NUEVO
const updatePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    // CORREGIDO: "eliminarImagenesIds" con 'n'
    let { tags, eliminarImagenesIds, ...datos } = req.body;

    const patrimonio = await Patrimonio.findByPk(id);
    if (!patrimonio)
      return res.status(404).json({ error: "Patrimonio no encontrado" });

    // 1. Imagen de la portada
    if (req.files && req.files["portada"]) {
      if (patrimonio.imagen_url) {
        // Asegúrate de que la ruta apunte correctamente a la carpeta raíz de tu proyecto
        const oldPath = path.join(__dirname, "..", "..", patrimonio.imagen_url);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.error("Error al borrar portada", err.message);
        }
      }
      datos.imagen_url = `/uploads/patrimonios/${req.files["portada"][0].filename}`;
    }

// 2. Borrar imagenes de la galeria
if (eliminarImagenesIds) {
      let idsProcesados = [];

      if (Array.isArray(eliminarImagenesIds)) {
        idsProcesados = eliminarImagenesIds;
      } else if (typeof eliminarImagenesIds === 'string' && eliminarImagenesIds.includes(',')) {
        idsProcesados = eliminarImagenesIds.split(',');
      } else {
        idsProcesados = [eliminarImagenesIds];
      }

      const ids = idsProcesados
                  .map(id => parseInt(id))
                  .filter(id => !isNaN(id));

      console.log("ID por imagen eliminada:", ids);

      if (ids.length > 0) {
        const imagenesABorrar = await ImagenPatrimonio.findAll({
          where: { 
            id: ids, 
            patrimonioId: id 
          },
        });

        for (const img of imagenesABorrar) {
          const cleanPath = img.url.startsWith('/') ? img.url.slice(1) : img.url;
          const filePath = path.resolve(process.cwd(), cleanPath);

          try {
            await fs.unlink(filePath);
          } catch (err) {
            console.log("No se encontró el archivo en disco, pero borraremos de DB.");
          }

          await img.destroy();
        }
      }
    }

    // 3. Agregar imagenes a la galeria
    if (req.files && req.files["imagenes"]) {
      const nuevasFotos = req.files["imagenes"].map((file) => ({
        url: `/uploads/patrimonios/${file.filename}`,
        patrimonioId: id,
      }));
      await ImagenPatrimonio.bulkCreate(nuevasFotos);
    }

    // 4. Manejo de tags
    if (tags) {
      if (!Array.isArray(tags)) tags = [tags];
      if (tags.length === 1 && tags[0].includes(",")) {
        tags = tags[0].split(",").map((t) => t.trim());
      }
    } else {
      tags = [];
    }

    // 5. Actualizar campos básicos
    await patrimonio.update(datos);

    // 6. Sincronizar tags
    if (tags.length > 0) {
      const tagsLimpios = tags.map((t) => t.trim().toLowerCase());
      const instanciasTags = await Promise.all(
        tagsLimpios.map((nombreTag) =>
          Tag.findOrCreate({ where: { nombre: nombreTag } }),
        ),
      );
      await patrimonio.setTags(instanciasTags.map((t) => t[0]));
    }

    // 7. Resultado final
    const resultado = await Patrimonio.findByPk(id, {
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
        { model: ImagenPatrimonio, as: "galeria" },
      ],
    });

    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Eliminar un patrimonio
const deletePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const borrado = await Patrimonio.destroy({ where: { id } });

    if (borrado) {
      return res.status(200).json({ message: "Patrimonio eliminado" });
    } else {
      res.status(404).json({ error: "No se encontró el registro" });
    }
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

    return res
      .status(200)
      .json({
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
  exportarPatrimonios
};
