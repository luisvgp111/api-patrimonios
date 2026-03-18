const sequelize = require('./src/db');
const Municipio = require('./src/models/Municipio');

//Este archivo fue utilizado para realizar la insercion de los 72 municipios en la tabla "Municipios"

const municipiosSonora = [
    "Aconchi", "Agua Prieta", "Alamos", "Altar", "Arivechi", "Arizpe", "Atil", "Bacadéhuachi", "Bacanora", "Bacerac",
    "Bacoachi", "Bácum", "Banámichi", "Baviácora", "Bavispe", "Benito Juárez", "Benjamín Hill", "Caborca", "Cajeme", "Cananea",
    "Carbó", "La Colorada", "Cucurpe", "Cumpas", "Divisaderos", "Empalme", "Etchojoa", "Fronteras", "Granados", "Guaymas",
    "Hermosillo", "Huachinera", "Huasabas", "Huatabampo", "Huépac", "Imuris", "Magdalena", "Mazatán", "Moctezuma", "Naco",
    "Nácori Chico", "Nacozari de García", "Navojoa", "Nogales", "Onavas", "Opodepe", "Oquitoa", "Pitiquito", "Puerto Peñasco", "Quiriego",
    "Rayón", "Rosario", "Sahuaripa", "San Felipe de Jesús", "San Javier", "San Luis Río Colorado", "San Miguel de Horcasitas", "San Pedro de la Cueva", "Santa Ana", "Santa Cruz",
    "Sáric", "Soyopa", "Suaqui Grande", "Tepache", "Trincheras", "Tubutama", "Ures", "Villa Hidalgo", "Villa Pesqueira", "Yécora",
    "General Plutarco Elías Calles", "San Ignacio Río Muerto"
];

async function seed() {
    try {
        await sequelize.sync();
        for (let nombre of municipiosSonora) {
            await Municipio.findOrCreate({
                where: { nombre: nombre }
            });
        }

        console.log('Municipios cargados.');
        process.exit();
    } catch (error) {
        console.error('Error al cargar municipios:', error);
        process.exit(1);
    }
}

seed();