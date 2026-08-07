import { models } from "../database/dbConnection.js";


export const opcionPreguntaRepository = {


    async create(data){

        return await models.OpcionPregunta.create(data);

    },


    async findAll(){

        return await models.OpcionPregunta.findAll();

    },


    async findById(id){

        return await models.OpcionPregunta.findByPk(id);

    },


    async findByPreguntaId(pregunta_id){

        return await models.OpcionPregunta.findAll({

            where:{
                pregunta_id
            }

        });

    },


    async update(id, data){

        const opcion = await models.OpcionPregunta.findByPk(id);


        if(!opcion){

            return null;

        }


        return await opcion.update(data);

    },


    async delete(id){

        const opcion = await models.OpcionPregunta.findByPk(id);


        if(!opcion){

            return null;

        }


        await opcion.destroy();


        return opcion;

    }


};