import { notificacionRepository } from "../../infraestructura/repositorios/notificacionRepositoryImpl.js";

import { obtenerNotificacionesUsuario } from "../../aplicacion/casos_de_uso/notificacion/obtenerNotificacionesUsuario.js";

import { obtenerNotificacionesNoLeidas } from "../../aplicacion/casos_de_uso/notificacion/obtenerNotificacionesNoLeidas.js";

import { marcarNotificacionLeida } from "../../aplicacion/casos_de_uso/notificacion/marcarNotificacionLeida.js";

import { marcarTodasNotificacionesLeidas } from "../../aplicacion/casos_de_uso/notificacion/marcarTodasNotificacionesLeidas.js";


// ============================================================
// OBTENER NOTIFICACIONES DEL USUARIO AUTENTICADO
// ============================================================

export const getNotificacionesUsuario = async (req, res) => {

    try {
     
        const user_id = req.user.id;

        const notificaciones =
            await obtenerNotificacionesUsuario(
                { notificacionRepository },
                user_id
            );

        return res.status(200).json(notificaciones);

    } catch (error) {

        console.error(error);

        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });

        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });

    }

};


// ============================================================
// OBTENER NOTIFICACIONES NO LEÍDAS
// ============================================================

export const getNotificacionesNoLeidas = async (req, res) => {

    try {

        const user_id = req.user.id;

        const notificaciones =
            await obtenerNotificacionesNoLeidas(
                { notificacionRepository },
                user_id
            );

        return res.status(200).json(notificaciones);

    } catch (error) {
        console.error(error);
        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });

        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });

    }

};


// ============================================================
// MARCAR NOTIFICACIÓN COMO LEÍDA
// ============================================================

export const markNotificacionLeida = async (req, res) => {

    try {

        const user_id = req.user.id;

        const { id } = req.params;

        const notificacion =
            await marcarNotificacionLeida(
                { notificacionRepository },
                id,
                user_id
            );

        return res.status(200).json(notificacion);

    } catch (error) {
        console.error(error);
        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });

        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });

    }

};


// ============================================================
// MARCAR TODAS LAS NOTIFICACIONES COMO LEÍDAS
// ============================================================

export const markTodasNotificacionesLeidas = async (req, res) => {

    try {

        const user_id = req.user.id;

        await marcarTodasNotificacionesLeidas(
            { notificacionRepository },
            user_id
        );

        return res.status(200).json({
            message: "Notificaciones marcadas como leídas"
        });

    } catch (error) {
        console.error(error);
        if (error.statusCode) {

            return res.status(error.statusCode).json({
                message: error.message
            });

        }

        return res.status(500).json({
            message: "Error interno del servidor"
        });

    }

};