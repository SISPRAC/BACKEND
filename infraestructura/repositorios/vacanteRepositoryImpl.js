import { models } from "../database/dbConnection.js";

export const vacanteRepository = {

    async findAll() {
        return await models.Vacante.findAll({
            include: [
                {
                    model: models.Convenio,
                    include: [
                        {
                            model: models.Empresa
                        }
                    ]
                },
                {
                    model: models.AperturaVacante,
                    include: [
                        {
                            model: models.Postulacion,
                            include: [
                                {
                                    model: models.Candidato,
                                    include: [
                                        {
                                            model: models.User
                                        },
                                        {
                                            model: models.Perfil,
                                            through: {
                                                attributes: ["calificacion"]
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            model: models.Periodo
                        }
                    ]
                },
                {
                    model: models.Perfil,
                    through: {
                        attributes: ["nivel_minimo"]
                    }
                }
            ]
        });
    },

    async findById(id) {
        return await models.Vacante.findByPk(id, {
            include: [
                {
                    model: models.Convenio,
                    include: [
                        {
                            model: models.Empresa
                        } //agregar despues lo de postulacion...
                    ]
                }
            ]
        });
    }

};