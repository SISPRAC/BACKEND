export const getEntregasInformeByPracticaInforme = async (
    entregaInformeRepository,
    practica_informe_id
) => {

    return await entregaInformeRepository.findByPracticaInformeId(
        practica_informe_id
    );

};