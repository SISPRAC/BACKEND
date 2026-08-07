export const getVacantes = async (vacanteRepository) => {

    const vacantes = await vacanteRepository.findAll();

    return vacantes.map(vacante => {

        const apertura = vacante.AperturaVacantes?.[0];

        return {
            id: vacante.id,
            titulo: vacante.nombre,
            descripcion: vacante.descripcion,
            estado: vacante.estado,

            cuposDisponibles: apertura?.cupos ?? 0,

            perfiles: vacante.Perfils?.map(perfil => ({
                id: perfil.id,
                nombre: perfil.nombre,
                nivel_minimo: perfil.PerfilVacante?.nivel_minimo
            })) || [],

            AperturaVacantes: vacante.AperturaVacantes?.map(apertura => ({
                id: apertura.id,
                cupos: apertura.cupos,
                estado: apertura.estado,

                candidatos: apertura.Postulacions?.map(postulacion => ({
                    idPostulacion: postulacion.id,
                    estadoPostulacion: postulacion.estado,

                    candidato: {
                        id: postulacion.Candidato?.id,
                        codigo: postulacion.Candidato?.codigo,
                        nombres: `${postulacion.Candidato?.Usuario?.nombres ?? ""} ${postulacion.Candidato?.Usuario?.apellidos ?? ""}`.trim(),
                        correo: postulacion.Candidato?.Usuario?.correo,

                        perfiles: postulacion.Candidato?.Perfils?.map(perfil => ({
                            id: perfil.id,
                            nombre: perfil.nombre,
                            calificacion: perfil.dataValues?.Candidato_perfi
                        })) || []
                    }
                })) || []
            })),

            periodo: {
                id: apertura?.Periodo?.id,
                nombre: apertura?.Periodo?.nombre
            },

            convenio: {
                id: vacante.Convenio?.id,
                estado: vacante.Convenio?.estado,
                fecha_inicio: vacante.Convenio?.fecha_inicio,
                fecha_fin: vacante.Convenio?.fecha_fin
            },

            empresa: {
                id: vacante.Convenio?.Empresa?.id,
                nombre: vacante.Convenio?.Empresa?.nombre,
                logoUrl: vacante.Convenio?.Empresa?.logo
            }
        };
    });
};