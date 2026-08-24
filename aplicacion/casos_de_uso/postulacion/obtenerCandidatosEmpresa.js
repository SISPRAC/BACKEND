import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export const obtenerCandidatosEmpresa = async (
    {
        empresaRepository,
        postulacionRepository
    },
    usuarioId
) => {

    const empresa =
        await empresaRepository.findByUserId(usuarioId);

    if (!empresa) {
        throw new NotFoundError(
            "No se encontró la empresa asociada al usuario"
        );
    }

    const postulaciones =
        await postulacionRepository.findByEmpresa(empresa.id);

    return postulaciones.map((postulacion) => {

        const candidato = postulacion.Candidato;
        const usuario = candidato?.Usuario;
        const hojaVida = candidato?.hojaVida;
        const vacante =
            postulacion.AperturaVacante?.Vacante;

        return {
            id: postulacion.id,

            codigo: candidato?.codigo,

            nombre: usuario
                ? `${usuario.nombres} ${usuario.apellidos}`
                : "",

            correo: usuario?.correo || "",

            telefono: usuario?.telefono || "",

            vacante: vacante?.nombre || "",

            estado: postulacion.estado,

            fechaPostulacion: postulacion.fecha_postulacion || null,

            fechaEleccion: postulacion.fecha_eleccion || null,

            hojaVida: hojaVida || null
        };
    });
};