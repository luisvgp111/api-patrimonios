const Patrimonio = require("./Patrimonio");
const Municipio = require("./Municipio");
const Tag = require("./Tag");
const Usuario = require("./Usuario");
const ImagenPatrimonio = require("./ImagenPatrimonio");
const Ubicacion = require("./Ubicacion");
const Link = require("./Link");  

// --- RELACIONES ---

// Municipio - Patrimonio
Municipio.hasMany(Patrimonio, { as: "patrimonios", foreignKey: "municipioId" });
Patrimonio.belongsTo(Municipio, { as: "municipio", foreignKey: "municipioId" });

// Patrimonio - Tag (muchos a muchos)
Patrimonio.belongsToMany(Tag, { through: "PatrimonioTag", as: "tags", foreignKey: "patrimonioId", onDelete: 'CASCADE' });
Tag.belongsToMany(Patrimonio, { through: "PatrimonioTag", as: "patrimonios", foreignKey: "tagId", onDelete: 'CASCADE' });

// Patrimonio - ImagenPatrimonio
Patrimonio.hasMany(ImagenPatrimonio, { as: 'galeria', foreignKey: 'patrimonioId', onDelete: 'CASCADE' });
ImagenPatrimonio.belongsTo(Patrimonio, { foreignKey: 'patrimonioId' });

// Patrimonio - Ubicacion
Patrimonio.hasMany(Ubicacion, { as: 'ubicaciones', foreignKey: 'patrimonioId', onDelete: 'CASCADE' });
Ubicacion.belongsTo(Patrimonio, { foreignKey: 'patrimonioId' });

// NUEVA RELACIÓN: Patrimonio - Link (uno a muchos)
Patrimonio.hasMany(Link, { as: 'links', foreignKey: 'patrimonioId', onDelete: 'CASCADE' });
Link.belongsTo(Patrimonio, { foreignKey: 'patrimonioId' });

module.exports = {
  Patrimonio,
  Municipio,
  Tag,
  Usuario,
  ImagenPatrimonio,
  Ubicacion,
  Link  
};