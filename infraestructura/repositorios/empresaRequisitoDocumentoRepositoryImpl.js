import { models } from "../database/dbConnection.js";

export const empresaRequisitoDocumentoRepository = {

    async findByEmpresa(empresa_id) {

        return await models.EmpresaRequisitoDocumento.findAll({

            where: { empresa_id },

            include: [
                {
                    model: models.Archivo,
                    as: "archivo"
                }
            ],

            order: [["id", "ASC"]]

        });

    },

    async findOne(empresa_id, tipo_requisito_documento_id, transaction) {

        return await models.EmpresaRequisitoDocumento.findOne({
            where: { empresa_id, tipo_requisito_documento_id },
            transaction
        });

    },

    async create(data, transaction) {

        return await models.EmpresaRequisitoDocumento.create(
            data,
            { transaction }
        );

    },

    async update(id, data, transaction) {

        const registro =
            await models.EmpresaRequisitoDocumento.findByPk(
                id,
                { transaction }
            );

        if (!registro) return null;

        await registro.update(data, { transaction });

        return registro;

    },
    async findById(id, transaction) {

        return await models.EmpresaRequisitoDocumento.findByPk(id, {
            transaction
        });

    },

    async findEmpresa(empresa_id) {

        return await models.Empresa.findByPk(empresa_id, {
            attributes: ["id", "es_publica"]
        });

    },

};