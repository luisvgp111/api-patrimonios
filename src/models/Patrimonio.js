const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Patrimonio = sequelize.define('Patrimonio', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM('Material', 'Inmaterial', 'Natural'),
        allowNull: false,
        defaultValue: 'Material'
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    referencias: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const storedValue = this.getDataValue('referencias');
            if (typeof storedValue !== 'string' || !storedValue.trim()) return [];

            try {
                const parsedValue = JSON.parse(storedValue);
                if (Array.isArray(parsedValue)) return parsedValue;
            } catch {
                // Older values are newline-separated URLs.
            }

            return storedValue
                .split(/\r?\n/)
                .map((url) => url.trim())
                .filter(Boolean)
                .map((url) => ({ titulo: '', autorInstitucion: '', url }));
        },
        set(value) {
            this.setDataValue(
                'referencias',
                Array.isArray(value) ? JSON.stringify(value) : value
            );
        }
    },
    autores: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '[]',
        get() {
            const storedValue = this.getDataValue('autores');
            if (typeof storedValue !== 'string' || !storedValue.trim()) return [];

            try {
                const parsedValue = JSON.parse(storedValue);
                if (Array.isArray(parsedValue)) {
                    return parsedValue
                        .filter((autor) => typeof autor === 'string')
                        .map((autor) => autor.trim())
                        .filter(Boolean);
                }
            } catch {
                return [];
            }

            return [];
        },
        set(value) {
            const autores = Array.isArray(value)
                ? value
                    .filter((autor) => typeof autor === 'string')
                    .map((autor) => autor.trim())
                    .filter(Boolean)
                : [];
            this.setDataValue('autores', JSON.stringify(autores));
        }
    },
    imagen_url: {
        type: DataTypes.STRING
    },
    municipioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: { msg: "Debes agregar un municipio" }
        }
    },
    localidad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'registrado'),
        defaultValue: 'pendiente',
        allowNull: false
    }
});

module.exports = Patrimonio;