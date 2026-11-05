import { fn, col } from "sequelize";
import { models } from "../database/dbConnection.js";

// Include reutilizable: Postulacion -> AperturaVacante -> Practica (filtrada por período)
const incluirPeriodo = (periodoId) => [
  {
    model: models.AperturaVacante,
    attributes: [],
    required: true,
    include: [
      {
        model: models.Practica,
        as: "practica",
        attributes: [],
        required: true,
        where: { periodo_id: periodoId },
      },
    ],
  },
];

export const reporteRepository = {
  // Postulaciones agrupadas por estado
  async postulacionesPorEstado(periodoId) {
    return await models.Postulacion.findAll({
      attributes: ["estado", [fn("COUNT", col("Postulacion.id")), "total"]],
      include: incluirPeriodo(periodoId),
      group: ["Postulacion.estado"],
      raw: true,
    });
  },

  // Practicantes del período agrupados por estado (En curso, Finalizada, Retirado, Cancelado)
  async practicantesPorEstado(periodoId) {
    return await models.PracticaPracticante.findAll({
      attributes: ["estado", [fn("COUNT", col("PracticaPracticante.id")), "total"]],
      include: [
        {
          model: models.Practica,
          as: "practica",
          attributes: [],
          required: true,
          where: { periodo_id: periodoId },
        },
      ],
      group: ["PracticaPracticante.estado"],
      raw: true,
    });
  },

  // Empresas distintas con vacantes abiertas en el período
  async empresasDelPeriodo(periodoId) {
    const filas = await models.AperturaVacante.findAll({
      attributes: [],
      include: [
        {
          model: models.Practica,
          as: "practica",
          attributes: [],
          required: true,
          where: { periodo_id: periodoId },
        },
        {
          model: models.Vacante,
          attributes: [],
          required: true,
          include: [
            { model: models.Convenio, attributes: ["empresa_id"], required: true },
          ],
        },
      ],
      raw: true,
    });

    return new Set(filas.map((f) => f["Vacante.Convenio.empresa_id"])).size;
  },

  // Oferta: cupos por cargo (todos y solo los disponibles)
  async cuposPorVacante(periodoId) {
    const aperturas = await models.AperturaVacante.findAll({
      attributes: ["cupos", "estado"],
      include: [
        {
          model: models.Practica,
          as: "practica",
          attributes: [],
          required: true,
          where: { periodo_id: periodoId },
        },
        {
          model: models.Vacante,
          attributes: ["nombre"],
          required: true,
        },
      ],
    });

    const mapa = {};
    aperturas.forEach((a) => {
      const cargo = a.Vacante.nombre;
      if (!mapa[cargo]) mapa[cargo] = { cargo, cupos: 0, disponibles: 0 };

      mapa[cargo].cupos += a.cupos;
      if (a.estado === "DISPONIBLE") mapa[cargo].disponibles += a.cupos;
    });

    return Object.values(mapa);
  },

  // Demanda: postulaciones por cargo
  async postulacionesPorVacante(periodoId) {
    const postulaciones = await models.Postulacion.findAll({
      attributes: ["id"],
      include: [
        {
          model: models.AperturaVacante,
          attributes: ["id"],
          required: true,
          include: [
            {
              model: models.Practica,
              as: "practica",
              attributes: [],
              required: true,
              where: { periodo_id: periodoId },
            },
            {
              model: models.Vacante,
              attributes: ["nombre"],
              required: true,
            },
          ],
        },
      ],
    });

    const mapa = {};
    postulaciones.forEach((p) => {
      const cargo = p.AperturaVacante.Vacante.nombre;
      mapa[cargo] = (mapa[cargo] || 0) + 1;
    });

    return Object.entries(mapa).map(([cargo, postulaciones]) => ({
      cargo,
      postulaciones,
    }));
  },
};