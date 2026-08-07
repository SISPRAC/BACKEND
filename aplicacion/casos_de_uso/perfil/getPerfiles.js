export const getPerfiles = async (perfilRepository) => {

    const perfiles = await perfilRepository.findAll();

    return perfiles;
};