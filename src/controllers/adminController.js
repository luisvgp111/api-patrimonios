const { where, Op } = require("sequelize");
const { Patrimonio, Municipio, Tag } = require("../models");

//    Endpoints de gestion, patrimonios (ADMINISTRADOR)

//Crear un patrimonio
const createPatrimonio = async (req, res) => {
  try {
    const { tags, ...datos } = req.body;

    if (tags) {
      if (!Array.isArray(tags)){
        tags = [tags];
      }
      if (tags.length === 1 && tags[0].includes(',')){
        tags = tags[0].split(',').map(t => t.trim());
      }
    } else {
      tags = []
    }

    const imagenUrl = req.file ? `/uploads/patrimonios/${req.file.filename}` : null;

    const nuevo = await Patrimonio.create({
      ...datos,
      imagen_url: imagenUrl
    });

    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagsLimpios = tags
        .filter((t) => t && typeof t === "string")
        .map((t) => t.trim().toLowerCase());

      if (tagsLimpios.length > 0) {
        const instanciasTags = await Promise.all(
          tagsLimpios.map((nombreTag) =>
            Tag.findOrCreate({ where: { nombre: nombreTag } }),
          ),
        );

        const tagsParaVincular = instanciasTags.map((t) => t[0]);
        await nuevo.setTags(tagsParaVincular);
      }
    }

    const resultado = await Patrimonio.findByPk(nuevo.id, {
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
      ],
    });

    return res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Actualizar un patrimonio
const updatePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags, ...datos } = req.body;

    const patrimonio = await Patrimonio.findByPk(id);
    if (!patrimonio) {
      return res.status(404).json({ error: "Patrimonio no encontrado" });
    }

    await patrimonio.update(datos);

    if (tags && Array.isArray(tags)) {
      const tagsLimpios = tags
        .filter((t) => t && typeof t === "string")
        .map((t) => t.trim().toLowerCase());

      const instanciasTags = await Promise.all(
        tagsLimpios.map((nombreTag) =>
          Tag.findOrCreate({ where: { nombre: nombreTag } }),
        ),
      );

      const tagsParaVincular = instanciasTags.map((t) => t[0]);
      await patrimonio.setTags(tagsParaVincular);
    }

    const resultado = await Patrimonio.findByPk(id, {
      include: [
        { model: Municipio, as: "municipio" },
        { model: Tag, as: "tags", through: { attributes: [] } },
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
  try{
    const {id} = req.params;
    const {nombre} = req.body;

    if(!nombre) return res.status(400).json({error: "El nombre es requerido"});
    
    const tag = await Tag.findByPk(id);
    if (!tag) return res.status(404).json({error: "Tag no encontrado"});

    tag.nombre = nombre.trim().toLowerCase();
    await tag.save();

    return res.status(200).json({mensaje: "Tag actualizado", tag})
  } catch (error) {
    return res.status(500).json({error: error.message})
  }
};

//Eliminar Tag
const deleteTag = async (req, res) => {
  try{
    const {id} = req.params;

    const tag = await Tag.findByPk(id);
    if (!tag){
      return res.status(400).json({error: "El tag ya no existe en la base de datos"})
    }

      await tag.destroy();

      return res.status(200).json({mensaje: `Tag '${tag.nombre}' eliminado globalmente con éxito.`});
  } catch (error) {
    return res.status(500).json({error: "Error al eliminar Tag: " + error.message});
  }
};


module.exports = {
  updateTag,
  deleteTag,
  createPatrimonio,
  updatePatrimonio,
  deletePatrimonio,
};