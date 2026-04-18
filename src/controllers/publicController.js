const { where, Op } = require("sequelize");
const { Tag, Municipio, Patrimonio } = require("../models");
const ImagenPatrimonio = require("../models/ImagenPatrimonio");

//      Endpoints de solo lectura para (Patrimonios)

//Obtener todos los patrimonios
const getAllPatrimonios = async (req, res) => {
  try {
    const { categoria, tag } = req.query; //Estas se usan en la url, ejemplo: ".../api/patrimonios?categoria=Material&tag=nombreDelTag"

    const whereConditions = {};

    const categoriasValidas = ['Material', 'Inmaterial', 'Biocultural'];

    if (categoria && categoriasValidas.includes(categoria)){
        whereConditions.categoria = categoria;
    }

    const patrimonios = await Patrimonio.findAll({
        where: whereConditions,
        include: [
            {model: Municipio, as: "municipio"},
            {
                model: Tag,
                as: "tags",
                through: {attributes: []},
                ...(tag && {
                    where: {nombre: {[Op.iLike]: `%${tag}%`}},
                    required: true
                })
            },
            {
              model: ImagenPatrimonio,
              as: "galeria"
            }
        ],
        order: [["nombre", "ASC"]]
    })

    return res.status(200).json(patrimonios);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Obtener patrimonio por ID
const getPatrimonioById = async (req, res) => {
  try {
    const { id } = req.params;
    const patrimonio = await Patrimonio.findByPk(id, {
      include: [
        {
          model: Municipio,
          as: "municipio",
          attributes: ["id", "nombre"],
        },
        {
          model: Tag,
          as: "tags",
          through: { attributes: [] },
        },
        {
          model: ImagenPatrimonio,
          as: "galeria"
        }
      ],
    });

    if (!patrimonio) return res.status(404).json({error: "No encontrado"});
    
    return res.json(patrimonio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//      Endpoints de solo lectura (Municipios)

//Obtener todos los Municipios
const getMunicipios = async (req, res) => {
  try {
    const municipios = await Municipio.findAll({ 
      attributes: ['id', 'nombre', 'latitud', 'longitud'],
      order: [["nombre", "ASC"]] });
    return res.json(municipios);
  } catch (error) {
    res.status(500).json({ error: "No se cargaron los municipios" });
  }
};

//Obtener municipio con sus patrimonios
const getMunicipiosConPatrimonios = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag, categoria } = req.query; //Ejemplo de uso ".../api/municipios/1?tag=nombreDelTag"

    const municipio = await Municipio.findByPk(id, {
      include: [
        {
          model: Patrimonio,
          as: "patrimonios",
          where: {
            ...(categoria && {categoria})
          },
          required: categoria ? true : false,
          include: [
            {
              model: Tag,
              as: "tags",
              through: { attributes: [] },
              ...(tag && {
                where: {
                  nombre: { [Op.iLike]: `%${tag.trim()}%` },
                },
                required: true,
              }),
            },
          ],
        },
      ],
      order: [[{ model: Patrimonio, as: "patrimonios" }, "nombre", "ASC"]],
    });

    if (!municipio) {
      return res.status(404).json({ mensaje: "Municipio no encontrado" });
    }

    return res.json(municipio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//      Endpoint de solo lectura (Tags)

//Obtener los Tags
const getAllTags = async (req, res) => {
    try{
        const tags = await Tag.findAll({
            include: [{
                model: Patrimonio,
                as: "patrimonios",
                attributes: ['id'],
                through: {attributes: []}
            }],
            order: [['nombre', 'ASC']]
        });

        const respuesta = tags.map(tag => ({
            id: tag.id,
            nombre: tag.nombre,
            totalUsos: tag.patrimonios.lenght
        }));

        return res.status(200).json(respuesta);
    } catch (error){
        return res.status(500).json({errro: error.message});
    }
}

module.exports = {
  getAllPatrimonios,
  getPatrimonioById,
  getMunicipios,
  getMunicipiosConPatrimonios,
  getAllTags
};
