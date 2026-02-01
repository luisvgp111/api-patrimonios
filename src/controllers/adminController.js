const Patrimonio = require("../models/Patrimonio");

const getAllPatrimonios = async (req, res) => {
  try {
    const patrimonios = await Patrimonio.findAll();
    res.json(patrimonios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPatrimonioById = async (req, res) => {
  try {
    const { id } = req.params;
    const patrimoniosById = await Patrimonio.findByPk(id);
    res.json(patrimoniosById);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPatrimonio = async (req, res) => {
  try {
    const nuevo = await Patrimonio.create(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePatrimonio = async (req, res) => {
  try {
    const { id } = req.params;
    const [actualizado] = await Patrimonio.update(req.body, { where: { id } });

    if (actualizado) {
      const patrimonioEditado = await Patrimonio.findByPk(id);
      return res.status(200).json(patrimonioEditado);
    } else {
      res.status(404).json({ mesnaje: "Patrimonio no encontrado" });
    }
  } catch (error) {
    res.status(404).json({ erro: error.message });
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

module.exports = {
  getAllPatrimonios,
  createPatrimonio,
  updatePatrimonio,
  deletePatrimonio,
  getPatrimonioById,
};
