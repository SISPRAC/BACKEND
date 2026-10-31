import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

// Postgres devuelve COUNT como string, así que se convierte a número
const aMapa = (filas) =>
    Object.fromEntries(filas.map((f) => [f.estado, Number(f.total)]));

const porcentaje = (n, total) =>
    total ? Math.round((n / total) * 1000) / 10 : 0;

export const getDashboardReporte = async (
    { reporteRepository, periodoRepository },
    periodoId
) => {
    // 1. Validaciones
    const id = Number(periodoId);

    if (!periodoId || !Number.isInteger(id) || id <= 0) {
        throw new BadRequestError("El período es obligatorio y debe ser un número válido.");
    }

    const periodo = await periodoRepository.findById(id);
    if (!periodo) {
        throw new NotFoundError("El período seleccionado no existe.");
    }

    // 2. Consultas en paralelo
    const [
        postulacionesEstado,
        practicantesEstado,
        empresas,
        cupos,
        postulacionesCargo,
    ] = await Promise.all([
        reporteRepository.postulacionesPorEstado(id),
        reporteRepository.practicantesPorEstado(id),
        reporteRepository.empresasDelPeriodo(id),
        reporteRepository.cuposPorVacante(id),
        reporteRepository.postulacionesPorVacante(id),
    ]);

    const post = aMapa(postulacionesEstado); // POSTULADO, ACEPTADO, RECHAZADO, RETIRADO
    const prac = aMapa(practicantesEstado);  // En curso, Finalizada, Retirado, Cancelado

    const totalPostulaciones = Object.values(post).reduce((a, b) => a + b, 0);

    // 3. Tarjetas
    const kpis = {
        empresas,
        cuposDisponibles: cupos.reduce((suma, c) => suma + c.disponibles, 0),
        postulaciones: totalPostulaciones,
        tasaAceptacion: porcentaje(post.ACEPTADO ?? 0, totalPostulaciones),
        practicantesActivos: prac["En curso"] ?? 0,
    };

    // 4. Practicantes por estado
    const practicantesPorEstado = [
        { estado: "En curso", total: prac["En curso"] ?? 0 },
        { estado: "Finalizada", total: prac.Finalizada ?? 0 },
        { estado: "Retirado", total: prac.Retirado ?? 0 },
        { estado: "Cancelado", total: prac.Cancelado ?? 0 },
    ];

    // 5. Oferta vs demanda por cargo (cupos vs postulaciones)
    const mapaCargos = {};

    cupos.forEach((c) => {
        mapaCargos[c.cargo] = { cargo: c.cargo, cupos: c.cupos, postulaciones: 0 };
    });

    postulacionesCargo.forEach((p) => {
        if (!mapaCargos[p.cargo]) {
            mapaCargos[p.cargo] = { cargo: p.cargo, cupos: 0, postulaciones: 0 };
        }
        mapaCargos[p.cargo].postulaciones = p.postulaciones;
    });

    const ofertaDemanda = Object.values(mapaCargos).sort(
        (a, b) => b.postulaciones - a.postulaciones
    );

    // 6. Distribución de resultados de selección (%)
    const resultadosSeleccion = [
        { estado: "Pendiente", valor: porcentaje(post.POSTULADO ?? 0, totalPostulaciones) },
        { estado: "Retirado", valor: porcentaje(post.RETIRADO ?? 0, totalPostulaciones) },
        { estado: "Aceptado", valor: porcentaje(post.ACEPTADO ?? 0, totalPostulaciones) },
        { estado: "Rechazado", valor: porcentaje(post.RECHAZADO ?? 0, totalPostulaciones) },
    ];

    return { kpis, practicantesPorEstado, ofertaDemanda, resultadosSeleccion };
};