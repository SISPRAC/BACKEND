import { DataTypes } from "sequelize";

const createPracticaEncuestaModel = (sequelize) => {

    const PracticaEncuesta = sequelize.define(
        "PracticaEncuesta",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            practica_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            plantilla_encuesta_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "PlantillaEncuesta",
                    key: "id"
                }
            },
        },
        {
            tableName: "PracticaEncuesta",
            freezeTableName: true,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["practica_id", "plantilla_encuesta_id"],
                },
            ],
        }
    );

    return PracticaEncuesta;
};

export default createPracticaEncuestaModel;