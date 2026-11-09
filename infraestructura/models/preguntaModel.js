import { DataTypes } from "sequelize";

const createPreguntaModel = (sequelize) => {

    const Pregunta = sequelize.define('Pregunta', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        plantilla_encuesta_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tipo: {
            type: DataTypes.ENUM('opcion_unica', 'opcion_multiple', 'texto_libre'),
            allowNull: false,
            defaultValue: 'opcion_unica'
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