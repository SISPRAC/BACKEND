import { models } from "../database/dbConnection.js";


export const respuestaEncuestaRepository = {


    async create(data){

        return await models.RespuestaEncuesta.create(data);

    },


    async findAll(){

        return await models.RespuestaEncuesta.findAll({

            include:[

                {
                    model: models.RespuestaPregunta
                }

            ]

        });

    },


    async findById(id){

        return await models.RespuestaEncuesta.findByPk(id,{

            include:[

                {
                    model: models.RespuestaPregunta
                }

            ]

        });

    },


    async delete(id){

        return await models.RespuestaEncuesta.destroy({

            where:{
                id
            }

        });

    },
     
    async countByPlantilla(id){

    return await models.RespuestaEncuesta.count({

        where:{
            practica_encuesta_id:id
        }

    });

}


};