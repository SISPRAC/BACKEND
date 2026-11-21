import { Op } from "../database/sequelizeOperators.js";
// infraestructura/repositorios/recordatorioRepositoryImpl.js

import { models } from "../database/dbConnection.js";

const ROL_PRACTICANTE = "Practicante"; // ← verifica el nombre exacto en tu tabla Rol

export const recordatorioRepository = {

    async encuestasPendientesPracticantes(fechaFin) {
        const practicas = await models.Practica.findAll({
            where: { fecha_fin: fechaFin },
            include: [
                { model: models.Periodo },
                {
                    model: models.PracticaEncuesta, as: "encuestas", required: true,
                    include: [{
                        model: models.PlantillaEncuesta, as: "plantilla", required: true,
                        include: [{ model: models.Rol, where: { nombre: ROL_PRACTICANTE }, required: true }]
                    }]
                },
                {
                    model: models.PracticaPracticante, as: "practicantes", required: true,
                    where: { estado: { [Op.in]: ["En curso", "Finalizada"] } }, // sin Retirado/Cancelado
                    include: [{
                        model: models.Practicante, as: "practicante", required: true,
                        include: [{
                            model: models.Candidato, as: "candidato", required: true,
                            include: [{
                                model: models.User, required: true,
                                attributes: ["id", "correo", "nombres", "apellidos"]
                            }]
                        }]
                    }]
                }
            ]
        });

        const encuestaIds = practicas.flatMap((p) => p.encuestas.map((e) => e.id));
        if (!encuestaIds.length) return [];

        const respondidas = await models.RespuestaEncuesta.findAll({
            where: { practica_encuesta_id: { [Op.in]: encuestaIds } },
            attributes: ["practica_encuesta_id", "practicante_id"],
            raw: true
        });
        const yaRespondio = new Set(
            respondidas.map((r) => `${r.practica_encuesta_id}-${r.practicante_id}`)
        );

        // Un solo correo por persona
        const porUsuario = new Map();
        for (const practica of practicas) {
            for (const encuesta of practica.encuestas) {
                for (const pp of practica.practicantes) {
                    if (yaRespondio.has(`${encuesta.id}-${pp.practicante_id}`)) continue;

                    const usuario = pp.practicante?.candidato?.Usuario;
                    if (!usuario?.id) continue;

                    const entrada = porUsuario.get(usuario.id) ?? { usuario, items: [] };
                    const item = `Encuesta de la práctica del periodo ${practica.Periodo.nombre}`;
                    if (!entrada.items.includes(item)) entrada.items.push(item);
                    porUsuario.set(usuario.id, entrada);
                }
            }
        }
        return [...porUsuario.values()];
    }
};