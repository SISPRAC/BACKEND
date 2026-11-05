import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

const CONVENIOS_PERMITIDOS = ["activo", "todos"];

// Fecha de hoy (YYYY-MM-DD) en hora de Colombia
const hoyColombia = () =>
    new Date().toLocaleDateString("en-CA", { timeZone: "America/Bogota" });

// Estados con los que un convenio puede estar en uso
const ESTADOS_VIGENTES = ["APROBADO"];
// (si ACTUALIZADO significa "renovado y ya válido", agrégalo aquí)

// Estados que indican que el convenio sí llegó a funcionar alguna vez
// (PENDIENTE, OBSERVACION y RECHAZADO no cuentan: nunca hubo datos)
const ESTADOS_CON_HISTORIAL = ["APROBADO", "ACTUALIZADO", "VENCIDO"];

// Aprobado Y dentro de sus fechas. Un APROBADO con fecha_fin pasada
// ya no es vigente aunque nadie haya cambiado su estado a VENCIDO.
const convenioVigente = (convenio, hoy) =>
    ESTADOS_VIGENTES.includes(convenio.estado) &&
    convenio.fecha_inicio <= hoy &&
    hoy <= convenio.fecha_fin;

const convenioConHistorial = (convenio) =>
    ESTADOS_CON_HISTORIAL.includes(convenio.estado);

export const obtenerEmpresasParaSelect = async (
    empresaRepository,
    filtroConvenio = "activo"
) => {

    if (!CONVENIOS_PERMITIDOS.includes(filtroConvenio)) {
        throw new BadRequestError(
            "El filtro de convenio debe ser 'activo' o 'todos'"
        );
    }

    const hoy = hoyColombia();

    const empresas =
        await empresaRepository.findAllConConvenios();

    const lista = empresas
        .map((empresa) => {
            const datos = empresa.toJSON();

            const vigente = datos.Convenios.some(
                (convenio) => convenioVigente(convenio, hoy)
            );
            const conHistorial = datos.Convenios.some(convenioConHistorial);

            // Solo tuvo convenios PENDIENTE / OBSERVACION / RECHAZADO:
            // nunca operó, no debe aparecer en ningún select
            if (!vigente && !conHistorial) return null;

            return {
                id: datos.id,
                nombre: datos.nombre,
                nit: datos.nit,
                convenioEstado: vigente ? "activo" : "vencido",
            };
        })
        .filter(Boolean);

    return filtroConvenio === "activo"
        ? lista.filter((empresa) => empresa.convenioEstado === "activo")
        : lista;
};