
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

import { crearNotificacion } from "../notificacion/crearNotificacion.js";

import {
    notificarConvenioRechazado
} from "../notificarEmail/notificarConvenioRechazado.js";

export const cambiarEstadoConvenio = async (
    convenioRepository,
    historialConvenioRepository,
    empresaRepository,
    notificacionRepository,
    id,
    data
) => {

    // ============================================================
    // BUSCAR CONVENIO
    // ============================================================

    const convenio =
        await convenioRepository.findById(id);

    if (!convenio) {
        throw new BadRequestError(
            "Convenio no encontrado"
        );
    }

    // ============================================================
    // VALIDAR APROBACIÓN
    // ============================================================

    if (data.estado === "APROBADO") {
        throw new BadRequestError(
            "Para aprobar el convenio debes subir el documento firmado."
        );
    }

    // ============================================================
    // VALIDAR MOTIVO DEL RECHAZO
    // ============================================================

    const comentario = data.comentario?.trim();

    if (data.estado === "RECHAZADO" && !comentario) {
        throw new BadRequestError(
            "Debes indicar el motivo del rechazo del convenio."
        );
    }

    // ============================================================
    // ACTUALIZAR ESTADO DEL CONVENIO
    // ============================================================

    await convenioRepository.update(id, {
        estado: data.estado
    });

    // ============================================================
    // REGISTRAR HISTORIAL
    // ============================================================

    await historialConvenioRepository.create({
        convenio_id: id,
        archivo_id: convenio.archivo_id,
        accion: data.estado,
        fecha: new Date(),
        comentario,
        usuario_id: data.usuario_id
    });

    // ============================================================
    // OBTENER CONVENIO ACTUALIZADO
    // ============================================================

    const convenioActualizado =
        await convenioRepository.findById(id);

    // ============================================================
    // NOTIFICAR RECHAZO
    // ============================================================

    if (data.estado === "RECHAZADO") {

        // Obtener empresa
        const empresa = await empresaRepository.findByIdConUsuario(
            convenio.empresa_id
        );

        if (empresa) {

            const usuarioEmpresa = empresa.Usuario;

            const nombreRepresentante = [
                usuarioEmpresa?.nombres,
                usuarioEmpresa?.apellidos
            ].filter(Boolean).join(" ");

            // --------------------------------------------
            // NOTIFICACIÓN INTERNA
            // --------------------------------------------

            if (empresa.usuario_id) {

                try {

                    await crearNotificacion(
                        { notificacionRepository },
                        {
                            usuario_id: empresa.usuario_id,

                            titulo: "Convenio rechazado",

                            descripcion: `El convenio de tu empresa "${empresa.nombre}" ha sido rechazado. Motivo: ${comentario}. Ingresa a SISPRAC para consultar las observaciones y realizar las correcciones correspondientes.`
                        }
                    );

                } catch (error) {

                    console.error(
                        "No se pudo crear la notificación interna del convenio rechazado:",
                        error.message
                    );

                }
            }

            // --------------------------------------------
            // NOTIFICACIÓN POR CORREO
            // --------------------------------------------

            if (usuarioEmpresa?.correo) {

                try {

                    await notificarConvenioRechazado({

                        correo: usuarioEmpresa.correo,

                        nombreRepresentante,

                        nombreEmpresa: empresa.nombre,

                        motivo: comentario

                    });

                } catch (error) {

                    console.error(
                        "No se pudo enviar el correo de rechazo del convenio:",
                        error.message
                    );

                }
            }
        }
    }

    return convenioActualizado;
};
