import { DataTypes } from "sequelize";


const createOpcionPreguntaModel = (sequelize) => {


const OpcionPregunta = sequelize.define('OpcionesPregunta', {


    id: {

        type: DataTypes.INTEGER,

        primaryKey: true,

        autoIncrement: true

    },


    pregunta_id: {

        type: DataTypes.INTEGER,

        allowNull: false,


        references: {

            model: "Pregunta",

            key: "id"

        }

    },


    texto: {

        type: DataTypes.STRING(255),

        allowNull: false

    }


}, {

    timestamps:false,

});


return OpcionPregunta;


}


export default createOpcionPreguntaModel;