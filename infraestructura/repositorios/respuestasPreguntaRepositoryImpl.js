import { models } from "../database/dbConnection.js";


export const respuestaPreguntaRepository = {


    async create(data) {

        return await models.RespuestaPregunta.create(data);

    },


    async findById(id) {

        return await models.RespuestaPregunta.findByPk(id);

    },


    async findAll() {

        return await models.RespuestaPregunta.findAll();

    },


    async update(id, data) {

        const respuesta = await models.RespuestaPregunta.findByPk(id);


        if(!respuesta){

            return null;

        }


        return await respuesta.update(data);

    },


    async delete(id) {

        const respuesta = await models.RespuestaPregunta.findByPk(id);


        if(!respuesta){

            return null;

        }


        await respuesta.destroy();


        return respuesta;

    },
   async countByPregunta(id){

    return await models.RespuestaPregunta.count({

        where:{
            pregunta_id:id
        }

    });

}


};