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

            periodo_plantilla_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "PracticaEncuesta",
            freezeTableName: true,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["practica_id", "periodo_plantilla_id"],
                },
            ],
        }
    );

    return PracticaEncuesta;
};

export default createPracticaEncuestaModel;