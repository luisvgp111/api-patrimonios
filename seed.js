const sequelize = require("./src/db");
const Municipio = require("./src/models/Municipio");

//Este archivo fue utilizado para realizar la insercion de los 72 municipios en la tabla "Municipios"

const seedMunicipios = async () => {
  const municipios = [
    { nombre: "Aconchi", latitud: 29.8253, longitud: -110.2247 },
    { nombre: "Agua Prieta", latitud: 31.3278, longitud: -109.5486 },
    { nombre: "Alamos", latitud: 27.0251, longitud: -108.9413 },
    { nombre: "Altar", latitud: 30.7183, longitud: -111.7372 },
    { nombre: "Arivechi", latitud: 28.9289, longitud: -109.1867 },
    { nombre: "Arizpe", latitud: 30.3347, longitud: -110.1633 },
    { nombre: "Atil", latitud: 30.8875, longitud: -111.5728 },
    { nombre: "Bacadéhuachi", latitud: 29.8106, longitud: -109.1417 },
    { nombre: "Bacanora", latitud: 28.9819, longitud: -109.3972 },
    { nombre: "Bacerac", latitud: 30.3547, longitud: -108.9272 },
    { nombre: "Bacoachi", latitud: 30.6319, longitud: -109.9694 },
    { nombre: "Bácum", latitud: 27.5519, longitud: -110.0817 },
    { nombre: "Banámichi", latitud: 30.0058, longitud: -110.2106 },
    { nombre: "Baviácora", latitud: 29.7136, longitud: -110.1569 },
    { nombre: "Bavispe", latitud: 30.4794, longitud: -108.9406 },
    { nombre: "Benjamín Hill", latitud: 30.1719, longitud: -111.1147 },
    { nombre: "Caborca", latitud: 30.7131, longitud: -112.1511 },
    { nombre: "Cajeme", latitud: 27.4864, longitud: -109.9408 },
    { nombre: "Cananea", latitud: 30.9889, longitud: -110.2831 },
    { nombre: "Carbó", latitud: 29.6833, longitud: -110.95 },
    { nombre: "La Colorada", latitud: 28.8058, longitud: -110.5769 },
    { nombre: "Cucurpe", latitud: 30.3303, longitud: -110.7067 },
    { nombre: "Cumpas", latitud: 29.9939, longitud: -109.7806 },
    { nombre: "Divisaderos", latitud: 29.6108, longitud: -109.4628 },
    { nombre: "Empalme", latitud: 27.96, longitud: -110.8139 },
    { nombre: "Etchojoa", latitud: 26.9103, longitud: -109.6256 },
    { nombre: "Fronteras", latitud: 30.8972, longitud: -109.6103 },
    { nombre: "Granados", latitud: 29.8653, longitud: -109.2847 },
    { nombre: "Guaymas", latitud: 27.9179, longitud: -110.8987 },
    { nombre: "Hermosillo", latitud: 29.073, longitud: -110.9559 },
    { nombre: "Huachinera", latitud: 30.2039, longitud: -108.955 },
    { nombre: "Huatabampo", latitud: 26.8247, longitud: -109.6417 },
    { nombre: "Huépac", latitud: 29.9144, longitud: -110.2014 },
    { nombre: "Imuris", latitud: 30.7761, longitud: -110.8581 },
    { nombre: "Magdalena", latitud: 30.63, longitud: -110.95 },
    { nombre: "Mazatán", latitud: 29.0047, longitud: -110.1378 },
    { nombre: "Moctezuma", latitud: 29.8033, longitud: -109.6739 },
    { nombre: "Naco", latitud: 31.3342, longitud: -109.9472 },
    { nombre: "Nácori Chico", latitud: 29.6881, longitud: -108.9739 },
    { nombre: "Nacozari de García", latitud: 30.375, longitud: -109.6833 },
    { nombre: "Navojoa", latitud: 27.0728, longitud: -109.4439 },
    { nombre: "Nogales", latitud: 31.3011, longitud: -110.9381 },
    { nombre: "Onavas", latitud: 28.4611, longitud: -109.5256 },
    { nombre: "Opodepe", latitud: 29.9272, longitud: -110.6272 },
    { nombre: "Oquitoa", latitud: 30.7431, longitud: -111.7347 },
    { nombre: "Pitiquito", latitud: 30.6764, longitud: -112.0628 },
    { nombre: "Puerto Peñasco", latitud: 31.3161, longitud: -113.5311 },
    { nombre: "Quiriego", latitud: 27.5253, longitud: -109.2611 },
    { nombre: "Rayón", latitud: 29.7128, longitud: -110.5694 },
    { nombre: "Rosario", latitud: 27.8542, longitud: -109.3644 },
    { nombre: "Sahuaripa", latitud: 29.0558, longitud: -109.2361 },
    { nombre: "San Felipe de Jesús", latitud: 29.8633, longitud: -110.2281 },
    { nombre: "San Javier", latitud: 28.5956, longitud: -109.7394 },
    { nombre: "San Luis Río Colorado", latitud: 32.4519, longitud: -114.7711 },
    {
      nombre: "San Miguel de Horcasitas",
      latitud: 29.4911,
      longitud: -110.7256,
    },
    { nombre: "San Pedro de la Cueva", latitud: 29.2861, longitud: -109.7344 },
    { nombre: "Santa Ana", latitud: 30.5436, longitud: -111.1186 },
    { nombre: "Santa Cruz", latitud: 31.2333, longitud: -110.5953 },
    { nombre: "Sáric", latitud: 31.1039, longitud: -111.3789 },
    { nombre: "Soyopa", latitud: 28.7611, longitud: -109.6381 },
    { nombre: "Suaqui Grande", latitud: 28.3917, longitud: -109.8878 },
    { nombre: "Tepache", latitud: 29.5314, longitud: -109.53 },
    { nombre: "Trincheras", latitud: 30.3986, longitud: -111.5303 },
    { nombre: "Tubutama", latitud: 30.8856, longitud: -111.4644 },
    { nombre: "Ures", latitud: 29.4267, longitud: -110.3878 },
    { nombre: "Villa Hidalgo", latitud: 30.1603, longitud: -109.3211 },
    { nombre: "Villa Pesqueira", latitud: 29.1172, longitud: -109.9383 },
    { nombre: "Yécora", latitud: 28.3719, longitud: -108.9242 },
    {
      nombre: "General Plutarco Elías Calles",
      latitud: 31.8497,
      longitud: -112.8592,
    },
    { nombre: "Benito Juárez", latitud: 27.1264, longitud: -109.8519 },
    { nombre: "San Ignacio Río Muerto", latitud: 27.4172, longitud: -110.2464 },
    { nombre: "Puerto Libertad", latitud: 29.9042, longitud: -112.6842 },
  ];

  try {
    await sequelize.sync({alter: true});
    console.log("Campos actualizados")

    await Municipio.bulkCreate(municipios, {
      updateOnDuplicate: ["latitud", "longitud"],
    });

    console.log("Municipios actualizados con coordenadas");
    process.exit(0);
  } catch (error) {
    console.error("Error al cargar municipios:", error);
    process.exit(1);
  }
};

seedMunicipios();