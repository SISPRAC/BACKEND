import { DataTypes } from "sequelize";

const createRespuestaPreguntaModel = (sequelize) => {

    const RespuestaPregunta = sequelize.define('RespuestaPregunta', {


        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },


        respuesta_encuesta_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "RespuestaEncuesta",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },


        pregunta_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Pregunta",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },


        respuesta: {
            type: DataTypes.TEXT,
            allowNull: false
        }


    }, {


        timestamps: false


    });


    return RespuestaPregunta;


}


export default createRespuestaPreguntaModel;