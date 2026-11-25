import { models } from "../database/dbConnection.js";
import { Op } from "../database/sequelizeOperators.js";

// Los errores pueden ser enormes (stack, respuestas de Google): se recortan.
const recortar = (msg) => String(msg ?? "Error desconocido").slice(0, 2000);

// Fecha de hoy (YYYY-MM-DD) en Colombia, para comparar con columnas DATEONLY
const hoyColombia = (offsetDias = 0) => {
    const d = new Date(Date.now() - offsetDias * 86_400_000);
    return d.toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
};

const sinPrefijo = (s) => String(s ?? "").trim().replace(/\s+/g, "_");

export const periodoRespaldoRepository = {

    // ---------- SELECCIÓN DE PERÍODOS PARA EL JOB ----------

    // Períodos ya terminados, sin prácticas en curso, que aún no se subieron a Drive
    // (y que no agotaron los reintentos).
    async periodosPendientesDeSubida({ maxIntentos }) {
        const periodos = await models.Periodo.findAll({
            where: { fecha_fin: { [Op.lt]: hoyColombia() } },
            include: [{ model: models.PeriodoRespaldo, as: "respaldo", required: false }],
            order: [["fecha_fin", "ASC"]],
        });

        const pendientes = [];
        for (const periodo of periodos) {
            const r = periodo.respaldo;
            if (r?.estado_subida === "SUBIDO") continue;
            if (r && r.intentos_subida >= maxIntentos) continue;

            const enCurso = await models.Practica.count({
                where: { periodo_id: periodo.id, estado: "EN_CURSO" },
            });
            if (enCurso === 0) pendientes.push(periodo);
        }
        return pendientes;
    },

    // Períodos ya subidos cuya fecha_fin supera `diasAntiguedad` y siguen sin comprimir.
    async periodosPendientesDeCompresion({ maxIntentos, diasAntiguedad }) {
        const periodos = await models.Periodo.findAll({
            where: { fecha_fin: { [Op.lt]: hoyColombia(diasAntiguedad) } },
            include: [{
                model: models.PeriodoRespaldo,
                as: "respaldo",
                required: true,
                where: {
                    estado_subida: "SUBIDO",
                    estado_compresion: { [Op.ne]: "COMPRIMIDO" },
                    intentos_compresion: { [Op.lt]: maxIntentos },
                },
            }],
            order: [["fecha_fin", "ASC"]],
        });
        return periodos;
    },

    // Períodos ya subidos a Drive, terminados hace más de `diasAntiguedad` días,
    // sin prácticas en curso y con archivos locales aún sin liberar.
    async periodosPendientesDeLiberacion({ maxIntentos, diasAntiguedad }) {
        const periodos = await models.Periodo.findAll({
            where: { fecha_fin: { [Op.lt]: hoyColombia(diasAntiguedad) } },
            include: [{
                model: models.PeriodoRespaldo,
                as: "respaldo",
                required: true,
                where: {
                    estado_subida: "SUBIDO",
                    local_liberado: false,
                    intentos_liberacion: { [Op.lt]: maxIntentos },
                },
            }],
            order: [["fecha_fin", "ASC"]],
        });

        const pendientes = [];
        for (const periodo of periodos) {
            const enCurso = await models.Practica.count({
                where: { periodo_id: periodo.id, estado: "EN_CURSO" },
            });
            if (enCurso === 0) pendientes.push(periodo);
        }
        return pendientes;
    },

    // ---------- ARCHIVOS A RESPALDAR ----------

    // Todos los archivos (tabla Archivos) ligados a un período.
    // Devuelve [{ id, nombre, url, carpeta, categoria, contexto }]
    //   carpeta   -> carpeta del practicante ("<codigo>_<Apellidos>_<Nombres>") o "_General"
    //   categoria -> subcarpeta dentro de la carpeta (Informes, Certificados, ...)
    //   contexto  -> prefijo legible del nombre del archivo
    // Un mismo archivo puede salir en varias carpetas (p. ej. una visita con varios practicantes).
    async obtenerArchivosDelPeriodo(periodoId) {
        const GENERAL = "_General";
        const encontrados = new Map();
        const agregar = (archivo, carpeta, categoria, contexto) => {
            if (!archivo) return;
            const clave = `${carpeta}|${categoria}|${archivo.id}`;
            if (encontrados.has(clave)) return;
            encontrados.set(clave, {
                id: archivo.id,
                nombre: archivo.nombre,
                url: archivo.url,
                carpeta,
                categoria,
                contexto,
            });
        };

        const practicas = await models.Practica.findAll({
            where: { periodo_id: periodoId },
            include: [{ model: models.Archivo, as: "archivoArl" }],
        });
        const practicaIds = practicas.map((p) => p.id);

        // La ARL cuelga de la práctica (no de un practicante): va a _General
        for (const p of practicas) {
            agregar(p.archivoArl, GENERAL, "ARL", `Practica_${p.id}`);
        }
        if (!practicaIds.length) return [...encontrados.values()];

        const asignaciones = await models.PracticaPracticante.findAll({
            where: { practica_id: { [Op.in]: practicaIds } },
            include: [
                { model: models.Archivo, as: "certificadoArchivo" },
                {
                    model: models.RetiroPracticante,
                    as: "retiro",
                    include: [{ model: models.Archivo, as: "archivoSoporte" }],
                },
                {
                    model: models.EntregaInforme,
                    as: "entregasInformes",
                    include: [
                        { model: models.Archivo, as: "archivo" },
                        {
                            model: models.PracticaRequisitoDocumento,
                            as: "practicaRequisitoDocumento",
                            include: [{ model: models.TipoRequisitoDocumento, as: "tipoRequisitoDocumento" }],
                        },
                    ],
                },
                {
                    model: models.Practicante,
                    as: "practicante",
                    include: [{
                        model: models.Candidato,
                        as: "candidato",
                        include: [
                            { model: models.User, attributes: ["nombres", "apellidos"] },
                            { model: models.Archivo, as: "hojaVida" },
                        ],
                    }],
                },
            ],
        });

        const carpetaPorAsignacion = new Map(); // practica_practicante_id -> carpeta
        const carpetaPorUsuario = new Map();    // usuario_id (del candidato) -> carpeta
        for (const a of asignaciones) {
            const cand = a.practicante?.candidato;
            const u = cand?.Usuario ?? cand?.User; // alias por defecto de Sequelize = nombre del modelo ('Usuario')
            const codigo = sinPrefijo(cand?.codigo) || `Practicante_${a.practicante_id}`;
            const carpeta = u
                ? `${codigo}_${sinPrefijo(`${u.apellidos}_${u.nombres}`)}`
                : codigo;

            carpetaPorAsignacion.set(a.id, carpeta);
            if (cand?.usuario_id) carpetaPorUsuario.set(cand.usuario_id, carpeta);

            agregar(cand?.hojaVida, carpeta, "Hoja de vida", "HojaVida");
            agregar(a.certificadoArchivo, carpeta, "Certificados", "Certificado");
            agregar(a.retiro?.archivoSoporte, carpeta, "Retiros", "Retiro");
            for (const e of a.entregasInformes ?? []) {
                const tipo = sinPrefijo(e.practicaRequisitoDocumento?.tipoRequisitoDocumento?.nombre);
                agregar(e.archivo, carpeta, "Informes", `${tipo}_v${e.version}`);
            }
        }

        // Documentos de requisitos: cuelgan de la práctica, así que se asignan al
        // practicante que los subió; los subidos por otros roles van a _General.
        const requisitos = await models.PracticaRequisitoDocumento.findAll({
            where: { practica_id: { [Op.in]: practicaIds } },
            include: [
                { model: models.TipoRequisitoDocumento, as: "tipoRequisitoDocumento" },
                {
                    model: models.PracticaRequisitoDocumentoSubido,
                    as: "documentosSubidos",
                    include: [{ model: models.Archivo, as: "archivo" }],
                },
            ],
        });
        for (const r of requisitos) {
            const tipo = sinPrefijo(r.tipoRequisitoDocumento?.nombre);
            for (const d of r.documentosSubidos ?? []) {
                const carpeta = carpetaPorUsuario.get(d.usuario_id) ?? GENERAL;
                agregar(d.archivo, carpeta, "Requisitos", `${tipo}_Practica_${r.practica_id}`);
            }
        }

        // Evidencias de visitas: se copian a la carpeta de cada practicante de la solicitud
        const asignacionIds = asignaciones.map((a) => a.id);
        if (asignacionIds.length) {
            const solicitudes = await models.SolicitudVisitaPracticante.findAll({
                where: { practica_practicante_id: { [Op.in]: asignacionIds } },
                include: [{
                    model: models.SolicitudVisita,
                    as: "solicitud",
                    include: [{
                        model: models.Visita,
                        as: "visita",
                        include: [{
                            model: models.VisitaArchivo,
                            as: "evidencias",
                            include: [{ model: models.Archivo, as: "archivo" }],
                        }],
                    }],
                }],
            });
            for (const sp of solicitudes) {
                const carpeta = carpetaPorAsignacion.get(sp.practica_practicante_id) ?? GENERAL;
                for (const ev of sp.solicitud?.visita?.evidencias ?? []) {
                    agregar(ev.archivo, carpeta, "Visitas", "Visita");
                }
            }
        }

        return [...encontrados.values()];
    },

    // ---------- ESTADO DE RESPALDO ----------

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

    // ---------- LIBERACIÓN DE ESPACIO LOCAL ----------
    // Suma lo liberado en esta corrida. `completo` = ya no queda nada por liberar.
    async registrarLiberacion(periodoId, { archivos, mb, completo, error }) {
        const registro = await this.obtenerOCrear(periodoId);
        return await registro.update({
            archivos_liberados_local: registro.archivos_liberados_local + archivos,
            mb_liberados_local: Number(registro.mb_liberados_local) + mb,
            local_liberado: completo,
            fecha_liberacion_local: archivos > 0 || completo ? new Date() : registro.fecha_liberacion_local,
            error_liberacion: error ? recortar(error) : null,
            intentos_liberacion: error
                ? registro.intentos_liberacion + 1
                : registro.intentos_liberacion,
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
