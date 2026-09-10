export const getPracticaInformes = async (
    practicaInformeRepository,
    practica_id
) => {

    return await practicaInformeRepository.findByPracticaId(
        practica_id
    );

};