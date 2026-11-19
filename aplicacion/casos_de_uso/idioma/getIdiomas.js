export const getIdiomas = async (idiomaRepository) => {

    const idiomas = await idiomaRepository.findAll();

    return idiomas;
};