import { models } from "../database/dbConnection.js";

export const postulacionRepository = {

    async create(data) {
        return await models.Postulacion.create(data);
    },

    async update(id, data) {
        return await models.Postulacion.update(data, {
            where: { id }
        });
    },

    async findByCandidatoAndApertura(
        candidatoId,
        aperturaVacanteId
    ) {
        return await models.Postulacion.findOne({
            where: {
                candidato_id: candidatoId,
                aperturaVacante_id: aperturaVacanteId
            }
        });
    },

    async countByAperturaVacante(aperturaVacanteId) {
        return await models.Postulacion.count({
            where: {
                aperturaVacante_id: aperturaVacanteId
            }
        });
    },

    async delete(id) {
        return await models.Postulacion.destroy({
            where: { id }
        });
    },

    async findById(id) {
        return await models.Postulacion.findByPk(id);
    },

    async findByEmpresa(empresaId) {

    return await models.Postulacion.findAll({

        include: [

            {
                model: models.Candidato,

                attributes: [
                    "id",
                    "codigo",
                    "hoja_vida_archivo_id"
                ],

                include: [

                    {
                        model: models.User,

                        attributes: [
                            "id",
                            "nombres",
                            "apellidos"
                        ]
                    },

                    {
                        model: models.Archivo,
                        as: "hojaVida",

                        attributes: [
                            "id",
                            "nombre",
                            "url",
                            "public_id",
                            "resource_type",
                            "fecha_subida"
                        ]
                    }

                ]
            },

            {
                model: models.AperturaVacante,
                required: true,

                include: [

                    {
                        model: models.Vacante,
                        required: true,

                        include: [

                            {
                                model: models.Convenio,
                                required: true,

                                where: {
                                    empresa_id: empresaId
                                }
                            }

                        ]
                    }

                ]
            }

        ]

    });
}

};