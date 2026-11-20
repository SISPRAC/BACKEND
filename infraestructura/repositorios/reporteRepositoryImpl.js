import SequelizePackage from "sequelize";
const { fn, col } = SequelizePackage;
import { models } from "../database/dbConnection.js";

// Practica filtrada por período
const incluirPractica = (periodoId) => ({
  model: models.Practica,
  as: "practica",
  attributes: [],
  required: true,
  where: { periodo_id: periodoId },
});

// AperturaVacante -> Practica (período) y, si viene empresaId,
// también Vacante -> Convenio filtrado por esa empresa
const incluirApertura = (periodoId, empresaId, attributes = []) => ({
  model: models.AperturaVacante,
  attributes,
  required: true,
  include: [
    incluirPractica(periodoId),
    ...(empresaId
      ? [
          {
            model: models.Vacante,
            attributes: [],
            required: true,
            include: [
              {
                model: models.Convenio,
                attributes: [],
                required: true,
                where: { empresa_id: empresaId },
              },
            ],
          },
        ]
      : []),
  ],
});

export const reporteRepository = {
  // Postulaciones agrupadas por estado
  async postulacionesPorEstado(periodoId, empresaId) {
    return await models.Postulacion.findAll({
      attributes: ["estado", [fn("COUNT", col("Postulacion.id")), "total"]],
      include: [incluirApertura(periodoId, empresaId)],
      group: ["Postulacion.estado"],
      raw: true,
    });
  },

  // Practicantes del período agrupados por estado
  // Con empresaId se llega a la empresa por Practica -> AperturaVacante
  // (alias "aperturasVacante", como está en dbConnection).
  async practicantesPorEstado(periodoId, empresaId) {
    return await models.PracticaPracticante.findAll({
      attributes: [
        "estado",
        [fn("COUNT", fn("DISTINCT", col("PracticaPracticante.id"))), "total"],
      ],
      include: [
        {
          model: models.Practica,
          as: "practica",
          attributes: [],
          required: true,
          where: { periodo_id: periodoId },
          include: empresaId
            ? [
                {
                  model: models.AperturaVacante,
                  as: "aperturasVacante",
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: models.Vacante,
                      attributes: [],
                      required: true,
                      include: [
                        {
                          model: models.Convenio,
                          attributes: [],
                          required: true,
                          where: { empresa_id: empresaId },
                        },
                      ],
                    },
                  ],
                },
              ]
            : [],
        },
      ],
      group: ["PracticaPracticante.estado"],
      raw: true,
    });
  },

  // Una fila por apertura: empresa, cargo, cupos y estado
  async aperturasDelPeriodo(periodoId, empresaId) {
    const aperturas = await models.AperturaVacante.findAll({
      attributes: ["id", "cupos", "estado"],
      include: [
        incluirPractica(periodoId),
        {
          model: models.Vacante,
          attributes: ["nombre"],
          required: true,
          include: [
            {
              model: models.Convenio,
              attributes: ["empresa_id"],
              required: true,
              ...(empresaId ? { where: { empresa_id: empresaId } } : {}),
              include: [
                // Asume Convenio.belongsTo(Empresa). Si tiene alias, agrégalo aquí.
                { model: models.Empresa, attributes: ["id", "nombre"], required: true },
              ],
            },
          ],
        },
      ],
    });

    return aperturas.map((a) => ({
      id: a.id,
      cupos: a.cupos,
      estado: a.estado,
      cargo: a.Vacante.nombre,
      empresaId: a.Vacante.Convenio.Empresa.id,
      empresa: a.Vacante.Convenio.Empresa.nombre,
    }));
  },

  // Por apertura: total de postulaciones y cuántas fueron aceptadas
  // (aceptada = cupo ocupado). [{ aperturaId, total, aceptadas }]
  async postulacionesPorApertura(periodoId, empresaId) {
    const postulaciones = await models.Postulacion.findAll({
      attributes: ["id", "estado"],
      include: [incluirApertura(periodoId, empresaId, ["id"])],
    });

    const mapa = {};
    postulaciones.forEach((p) => {
      const aperturaId = p.AperturaVacante.id;
      if (!mapa[aperturaId]) mapa[aperturaId] = { aperturaId, total: 0, aceptadas: 0 };
      mapa[aperturaId].total += 1;
      if (p.estado === "ACEPTADO") mapa[aperturaId].aceptadas += 1;
    });

    return Object.values(mapa);
  },
};