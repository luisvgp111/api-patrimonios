const Patrimonio = require("../models/Patrimonio");
const Municipio = require("../models/Municipio");

//Endpoints de los patrimonios

const getAllPatrimonios = async (req, res) => {
  try {
    const patrimonios = await Patrimonio.findAll({
      include: [
        {
          model: Municipio,
          as: "municipio",
          attributes: ["id", "nombre"],
        },
      ],
    });
    res.json(patrimonios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatrimonioById = async (req, res) => {
  try {
    const { id } = req.params;
    const patrimoniosById = await Patrimonio.findByPk(id, {
      include: [
        {
          model: Municipio,
          as: "municipio",
          attributes: ["id", "nombre"],
        },
      ],
    });
    res.json(patrimoniosById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPatrimonio = async (req, res) => {
  try {
    const nuevo = await Patrimonio.create(req.body);

    const patrimonioConMunicipio = await Patrimonio.findByPk(nuevo.id, {
      include: [{ model: Municipio, as: "municipio" }],
    });

    res.status(201).json(patrimonioConMunicipio);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const [filasAfectadas] = await Patrimonio.update(req.body, {
      where: { id },
    });

    if (filasAfectadas > 0) {
      const patrimonioEditado = await Patrimonio.findByPk(id, {
        include: [{ model: Municipio, as: "municipio" }],
      });
      return res.status(200).json(patrimonioEditado);
    }

    return res.status(404).json({ mensaje: "Patrimonio no encontrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

//Enpoint para obtener los Municipios

const getMunicipios = async (req, res) => {
  try {
    const lista = await Municipio.findAll({ order: [["nombre", "ASC"]] });
    return res.json(lista);
  } catch (error) {
    res.status(500).json({ error: "No se cargaron los municipios" });
  }
};

//Endpoints para obtener los municipios y los patrimonios que pertenecen a el

const getMunicipiosConPatrimonios = async (req, res) => {
  try {
    const { id } = req.params;
    const municipio = await Municipio.findByPk(id, {
      include: [
        {
          model: Patrimonio,
          as: "patrimonios",
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

module.exports = {
  getAllPatrimonios,
  createPatrimonio,
  updatePatrimonio,
  deletePatrimonio,
  getPatrimonioById,
  getMunicipios,
  getMunicipiosConPatrimonios,
};
