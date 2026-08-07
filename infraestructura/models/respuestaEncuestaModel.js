import { DataTypes } from "sequelize";

const createRespuestaEncuestaModel = (sequelize) => {

    const RespuestaEncuesta = sequelize.define(
        "RespuestaEncuesta",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            practica_encuesta_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            fecha: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "RespuestaEncuesta",
            freezeTableName: true,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["usuario_id", "practica_encuesta_id"],
                },
            ],
        }
    );

    return RespuestaEncuesta;
};

export default createRespuestaEncuestaModel;