import { BadRequestError } from "../../../shared/errors/BadRequestError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

// Postgres devuelve COUNT como string, así que se convierte a número
const aMapa = (filas) =>
    Object.fromEntries(filas.map((f) => [f.estado, Number(f.total)]));

const porcentaje = (n, total) =>
    total ? Math.round((n / total) * 1000) / 10 : 0;

const idValido = (valor) => {
    const n = Number(valor);
    return Number.isInteger(n) && n > 0 ? n : null;
};

export const getDashboardReporte = async (
    { reporteRepository, periodoRepository },
    periodoId,
    empresaId // opcional: si no viene, es la vista global
) => {
    // 1. Validaciones
    const id = idValido(periodoId);
    if (!id) {
        throw new BadRequestError("El período es obligatorio y debe ser un número válido.");
    }

    let idEmpresa = null;
    if (empresaId !== undefined && empresaId !== null && empresaId !== "") {
        idEmpresa = idValido(empresaId);
        if (!idEmpresa) {
            throw new BadRequestError("La empresa debe ser un número válido.");
        }
    }

    const periodo = await periodoRepository.findById(id);
    if (!periodo) {
        throw new NotFoundError("El período seleccionado no existe.");
    }

    // 2. Consultas en paralelo (todas respetan el filtro de empresa)
    const [
        postulacionesEstado,
        practicantesEstado,
        aperturas,
        postulacionesApertura,
    ] = await Promise.all([
        reporteRepository.postulacionesPorEstado(id, idEmpresa),
        reporteRepository.practicantesPorEstado(id, idEmpresa),
        reporteRepository.aperturasDelPeriodo(id, idEmpresa),
        reporteRepository.postulacionesPorApertura(id, idEmpresa),
    ]);

    const post = aMapa(postulacionesEstado); // POSTULADO, ACEPTADO, RECHAZADO, RETIRADO
    const prac = aMapa(practicantesEstado);  // En curso, Finalizada, Retirado, Cancelado

    const totalPostulaciones = Object.values(post).reduce((a, b) => a + b, 0);

    // 3. Vacantes: una fila por (empresa + cargo), con su empresa a la vista
    const postPorApertura = Object.fromEntries(
        postulacionesApertura.map((p) => [p.aperturaId, p])
    );

    const mapaVacantes = {};
    aperturas.forEach((a) => {
        const clave = `${a.empresaId}|${a.cargo}`;
        if (!mapaVacantes[clave]) {
            mapaVacantes[clave] = {
                id: clave,
                empresaId: a.empresaId,
                empresa: a.empresa,
                cargo: a.cargo,
                cupos: 0,
                cuposDisponibles: 0,
                cuposOcupados: 0,
                cuposLibres: 0,
                postulaciones: 0,
            };
        }
        const v = mapaVacantes[clave];
        v.cupos += a.cupos;
        if (a.estado === "DISPONIBLE") v.cuposDisponibles += a.cupos;
        v.postulaciones += postPorApertura[a.id]?.total ?? 0;
        v.cuposOcupados += postPorApertura[a.id]?.aceptadas ?? 0;
    });

    // Libres = cupos - aceptadas (nunca negativo)
    Object.values(mapaVacantes).forEach((v) => {
        v.cuposLibres = Math.max(v.cupos - v.cuposOcupados, 0);
    });

    const vacantes = Object.values(mapaVacantes).sort(
        (a, b) => a.empresa.localeCompare(b.empresa) || a.cargo.localeCompare(b.cargo)
    );

    // 4. Tarjetas
    const kpis = {
        empresas: new Set(vacantes.map((v) => v.empresaId)).size,
        cuposDisponibles: vacantes.reduce((s, v) => s + v.cuposDisponibles, 0),
        postulaciones: totalPostulaciones,
        tasaAceptacion: porcentaje(post.ACEPTADO ?? 0, totalPostulaciones),
        practicantesActivos: prac["En curso"] ?? 0,
    };

    // 5. Practicantes por estado
    const practicantesPorEstado = [
        { estado: "En curso", total: prac["En curso"] ?? 0 },
        { estado: "Finalizada", total: prac.Finalizada ?? 0 },
        { estado: "Retirado", total: prac.Retirado ?? 0 },
        { estado: "Cancelado", total: prac.Cancelado ?? 0 },
    ];

    // 6. Oferta vs demanda para la gráfica.
    // En la vista global el nombre del cargo lleva la empresa ("Cargo · Empresa");
    // con una empresa seleccionada solo va el cargo.
    const ofertaDemanda = vacantes
        .map((v) => ({
            cargo: idEmpresa ? v.cargo : `${v.cargo} · ${v.empresa}`,
            empresa: v.empresa,
            cupos: v.cupos,
            postulaciones: v.postulaciones,
        }))
        .sort((a, b) => b.postulaciones - a.postulaciones);

    // 6b. Ocupación de cupos: por empresa en la vista global,
    // por cargo cuando hay una empresa seleccionada
    const mapaOcupacion = {};
    vacantes.forEach((v) => {
        const nombre = idEmpresa ? v.cargo : v.empresa;
        if (!mapaOcupacion[nombre]) {
            mapaOcupacion[nombre] = { nombre, ocupados: 0, libres: 0 };
        }
        mapaOcupacion[nombre].ocupados += Math.min(v.cuposOcupados, v.cupos);
        mapaOcupacion[nombre].libres += v.cuposLibres;
    });
    const ocupacion = Object.values(mapaOcupacion).sort(
        (a, b) => b.ocupados + b.libres - (a.ocupados + a.libres)
    );

    // 7. Distribución de resultados de selección (%)
    const resultadosSeleccion = [
        { estado: "Pendiente", valor: porcentaje(post.POSTULADO ?? 0, totalPostulaciones) },
        { estado: "Aceptado", valor: porcentaje(post.ACEPTADO ?? 0, totalPostulaciones) },
        { estado: "Rechazado", valor: porcentaje(post.RECHAZADO ?? 0, totalPostulaciones) },
    ];

    return { kpis, practicantesPorEstado, ofertaDemanda, vacantes, ocupacion, resultadosSeleccion };
};