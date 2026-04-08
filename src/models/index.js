const Patrimonio = require("./Patrimonio");
const Municipio = require("./Municipio");
const Tag = require("./Tag");
const Usuario = require("./Usuario");

// --- RELACIONES ---

// Relacion: Municipio -> Patrimonio
Municipio.hasMany(Patrimonio, { as: "patrimonios", foreignKey: "municipioId" });
Patrimonio.belongsTo(Municipio, { as: "municipio", foreignKey: "municipioId" });

// Relacion: Patrimonio <-> Tag
Patrimonio.belongsToMany(Tag, {through: "PatrimonioTag", as: "tags", foreignKey: "patrimonioId", onDelete: 'CASCADE'});

//Relacion: Tag -> Patrimonio
Tag.belongsToMany(Patrimonio, {through: "PatrimonioTag", as: "patrimonios", foreignKey: "tagId", onDelete: 'CASCADE'});


module.exports = {
  Patrimonio,
  Municipio,
  Tag,
  Usuario,
};
