import { DataTypes } from "sequelize";

const createPreguntaModel = (sequelize) => {

    const Pregunta = sequelize.define('Pregunta', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        periodo_plantilla_id: {
            type: DataTypes.INTEGER,
            allowNull: true,

            references: {
                model: "PeriodoPlantillas",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        orden: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

    }, {

        timestamps: false

    });

    return Pregunta;
}

export default createPreguntaModel;