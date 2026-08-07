import { models } from "../database/dbConnection.js";


export const preguntaRepository = {


    async create(data) {

        return await models.Pregunta.create(data);

    },


    async update(id,data){

        return await models.Pregunta.update(data,{

            where:{
                id
            }

        });

    },


    async findByPlantilla(plantilla_encuesta_id){

        return await models.Pregunta.findAll({

            where:{
                plantilla_encuesta_id
            },

            order:[
                ["orden","ASC"]
            ]

        });

    },


    async delete(id){

        return await models.Pregunta.destroy({

            where:{
                id
            }

        });

    },
    async findById(id){

    return await models.Pregunta.findByPk(id,{

        include:[
            {
                model: models.OpcionPregunta
            }
        ]

    });

}


};