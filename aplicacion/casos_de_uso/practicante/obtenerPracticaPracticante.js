import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerPracticaPracticante = async (
    practicanteRepository,
    usuarioId
) => {

    const datos = await practicanteRepository.findMiPractica(usuarioId);

    if (!datos) {
        throw new NotFoundError(
            "No se encontró el practicante."
        );
    }

    if (!datos.practicaPracticante) {
        throw new NotFoundError(
            "El practicante no tiene una práctica en curso."
        );
    }

    if (!datos.postulacion) {
        throw new NotFoundError(
            "El practicante no tiene una postulación aceptada."
        );
    }

    const aperturaVacante =
        datos.postulacion.AperturaVacante;

    const vacante =
        aperturaVacante?.Vacante;

    const empresa =
        vacante?.Convenio?.Empresa;

    const tutor =
        aperturaVacante?.TutorEmpresa;

    return {
        practica: datos.practicaPracticante.practica,

        vacante: vacante
            ? {
                id: vacante.id,
                nombre: vacante.nombre,
                descripcion: vacante.descripcion,
                estado: vacante.estado
            }
            : null,

        empresa: empresa
            ? {
                id: empresa.id,
                nit: empresa.nit,
                nombre: empresa.nombre,
                direccion: empresa.direccion,
                logo: empresa.logo,

                usuario: empresa.Usuario
                    ? {
                        id: empresa.Usuario.id,
                        nombres: empresa.Usuario.nombres,
                        apellidos: empresa.Usuario.apellidos,
                        correo: empresa.Usuario.correo,
                        telefono: empresa.Usuario.telefono
                    }
                    : null
            }
            : null,

        tutor: tutor
            ? {
                id: tutor.id,
                cargo: tutor.cargo,

                usuario: tutor.Usuario
                    ? {
                        id: tutor.Usuario.id,
                        nombres: tutor.Usuario.nombres,
                        apellidos: tutor.Usuario.apellidos,
                        correo: tutor.Usuario.correo,
                        telefono: tutor.Usuario.telefono
                    }
                    : null
            }
            : null
    };
};