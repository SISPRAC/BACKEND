import { DataTypes } from "sequelize";

const createCandidatoIdiomaModel = (sequelize) => {

    const niveles = ["A1", "A2", "B1", "B2", "C1", "C2", "NATIVO"];

    const CandidatoIdioma = sequelize.define("Candidato_idioma", {

        candidato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Candidatos",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        idioma_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Idiomas",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        lee: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isIn: [niveles]
            }
        },

        habla: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isIn: [niveles]
            }
        },

        escucha: {
            type: DataTypes.STRING(6),
            allowNull: false,
            validate: {
                isIn: [niveles]
            }
        }

    }, {
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["candidato_id", "idioma_id"]
            }
        ]
    });

    return CandidatoIdioma;
};

export default createCandidatoIdiomaModel;