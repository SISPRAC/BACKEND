import { models } from "../database/dbConnection.js";

// Los errores pueden ser enormes (stack, respuestas de Google): se recortan.
const recortar = (msg) => String(msg ?? "Error desconocido").slice(0, 2000);

export const periodoRespaldoRepository = {

    // Para la vista del admin: todos los períodos con su estado de respaldo
    async findAll() {
        return await models.PeriodoRespaldo.findAll({
            include: [{
                model: models.Periodo,
                as: "periodo",
                attributes: ["id", "nombre", "fecha_inicio", "fecha_fin"],
            }],
            order: [[{ model: models.Periodo, as: "periodo" }, "fecha_inicio", "DESC"]],
        });
    },

    async findByPeriodoId(periodoId) {
        return await models.PeriodoRespaldo.findOne({
            where: { periodo_id: periodoId },
        });
    },

    // Crea la fila la primera vez; si ya existe la devuelve (idempotente)
    async obtenerOCrear(periodoId) {
        const [registro] = await models.PeriodoRespaldo.findOrCreate({
            where: { periodo_id: periodoId },
            defaults: { periodo_id: periodoId },
        });
        return registro;
    },

    // ---------- SUBIDA ----------
    async marcarSubidoOk(periodoId, { folderId, folderUrl }) {
        return await models.PeriodoRespaldo.update({
            estado_subida: "SUBIDO",
            fecha_subida: new Date(),
            error_subida: null,
            drive_folder_id: folderId,
            drive_folder_url: folderUrl ?? null,
        }, { where: { periodo_id: periodoId } });
    },

    async marcarSubidaFallo(periodoId, error) {
        const registro = await this.obtenerOCrear(periodoId);
        return await registro.update({
            estado_subida: "FALLO",
            fecha_subida: new Date(),
            error_subida: recortar(error?.message ?? error),
            intentos_subida: registro.intentos_subida + 1,
        });
    },

    // ---------- COMPRESIÓN ----------
    async marcarComprimidoOk(periodoId, { zipId, zipUrl }) {
        return await models.PeriodoRespaldo.update({
            estado_compresion: "COMPRIMIDO",
            fecha_compresion: new Date(),
            error_compresion: null,
            drive_zip_id: zipId,
            drive_zip_url: zipUrl ?? null,
        }, { where: { periodo_id: periodoId } });
    },

    async marcarCompresionFallo(periodoId, error) {
        const registro = await this.obtenerOCrear(periodoId);
        return await registro.update({
            estado_compresion: "FALLO",
            fecha_compresion: new Date(),
            error_compresion: recortar(error?.message ?? error),
            intentos_compresion: registro.intentos_compresion + 1,
        });
    },
};
