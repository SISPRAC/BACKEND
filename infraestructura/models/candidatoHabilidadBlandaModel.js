import { DataTypes } from "sequelize";

const createCandidatoHabilidadBlandaModel = (sequelize) => {

    const CandidatoHabilidadBlanda = sequelize.define("Candidato_habilidad_blanda", {

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

        habilidad_blanda_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "HabilidadBlandas",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }

    }, {
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["candidato_id", "habilidad_blanda_id"]
            }
        ]
    });

    return CandidatoHabilidadBlanda;
};

export default createCandidatoHabilidadBlandaModel;