import { DataTypes } from "sequelize";

const createGrupoCandidatoModel = (sequelize) => {
    const GrupoCandidato = sequelize.define("GrupoCandidato", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        grupo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Grupos",
                key: "id"
            }
        },

        candidato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Candidatos",
                key: "id"
            }
        }
    }, {
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["grupo_id", "candidato_id"]
            }
        ]
    });

    return GrupoCandidato;
};

export default createGrupoCandidatoModel;