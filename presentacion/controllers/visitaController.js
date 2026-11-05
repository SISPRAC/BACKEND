import { actualizarVisita } from "../../aplicacion/casos_de_uso/visita/actualizarVisita.js";
import { obtenerVisita } from "../../aplicacion/casos_de_uso/visita/obtenerVisita.js";
import { obtenerVisitaPorSolicitud } from "../../aplicacion/casos_de_uso/visita/obtenerVisitaPorSolicitud.js";
import { obtenerVisitasPorPracticante } from "../../aplicacion/casos_de_uso/visita/obtenerVisitasPorPracticante.js";

import { visitaRepository } from "../../infraestructura/repositorios/visitaRepositoryImpl.js";
import { visitaArchivoRepository } from "../../infraestructura/repositorios/visitaArchivoRepositoryImpl.js";
import { archivoRepository } from "../../infraestructura/repositorios/archivoRepositoryImpl.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";

import { sequelize } from "../../infraestructura/database/dbConnection.js";


export const actualizarVisitaController = async (req, res) => {
    try {
        const fotos = req.files?.fotos || [];
        const acta = req.files?.acta?.[0] || null;

        let fotosReemplazo = [];

        if (req.body.fotos_reemplazo) {
            try {
                fotosReemplazo = JSON.parse(
                    req.body.fotos_reemplazo
                );
            } catch (error) {
                console.log("Error al parsear fotos_reemplazo:", error);
                return res.status(400).json({
                    message:
                        "El formato de las fotografías a reemplazar no es válido"
                });
            }
        }

        const fotosProcesadas = fotos.map((foto, index) => ({
            buffer: foto.buffer,
            originalname: foto.originalname,
            mimetype: foto.mimetype,
            reemplazar_visita_archivo_id: fotosReemplazo[index]
                ? Number(fotosReemplazo[index])
                : null
        }));

        const visita = await actualizarVisita(
            sequelize,
            visitaRepository,
            visitaArchivoRepository,
            archivoRepository,
            TutorDocenteRepository,
            {
                visita_id: req.params.id,
                usuario_id: req.user.id,
                fecha_realizada: req.body.fecha_realizada,
                descripcion: req.body.descripcion,
                fotos: fotosProcesadas,
                acta
            }
        );

        return res.status(200).json({
            message: "Visita actualizada correctamente",
            data: visita
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


// Obtener visita por su propio ID
export const obtenerVisitaController = async (req, res) => {
    try {
        const visita = await obtenerVisita(
            { visitaRepository },
            req.params.id
        );

        return res.status(200).json({
            data: visita
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


// Obtener visita mediante el ID de SolicitudVisita
export const obtenerVisitaPorSolicitudController = async (req, res) => {
    try {
        const visita = await obtenerVisitaPorSolicitud(
            { visitaRepository },
            req.params.solicitudVisitaId
        );

        return res.status(200).json({
            data: visita
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error("Error al obtener visita por solicitud:", error);

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};


// Obtener visitas mediante el ID del practicante
export const obtenerVisitasPorPracticanteController = async (req, res) => {
    try {
        const visitas = await obtenerVisitasPorPracticante(
            { visitaRepository },
            req.params.practicanteId
        );

        return res.status(200).json({
            data: visitas
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                message: error.message
            });
        }

        console.error(
            "Error al obtener visitas por practicante:",
            error
        );

        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};
