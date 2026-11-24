import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

const NIVELES_PERFIL = ["R", "B", "MB"];
const NIVELES_IDIOMA = ["A1", "A2", "B1", "B2", "C1", "C2", "NATIVO"];

export const getPerfilProfesional = async (repos, userId) => {
    const { candidatoRepository, candidatoPerfilRepository,
        candidatoHabilidadBlandaRepository, candidatoIdiomaRepository } = repos;

    const candidato = await candidatoRepository.findByUserId(userId);
    if (!candidato) throw new NotFoundError("Candidato no encontrado");

    const [perfiles, habilidades, idiomas] = await Promise.all([
        candidatoPerfilRepository.findByCandidatoId(candidato.id),
        candidatoHabilidadBlandaRepository.findByCandidatoId(candidato.id),
        candidatoIdiomaRepository.findByCandidatoId(candidato.id)
    ]);

    return {
        perfiles: perfiles.map(p => ({
            perfil_id: p.perfil_id, nivel: p.nivel, nombre: p.Perfil?.nombre
        })),
        habilidadesBlandas: habilidades.map(h => ({
            habilidad_blanda_id: h.habilidad_blanda_id, nombre: h.habilidadBlanda?.nombre
        })),
        idiomas: idiomas.map(i => ({
            idioma_id: i.idioma_id, nombre: i.idioma?.nombre,
            lee: i.lee, habla: i.habla, escucha: i.escucha
        }))
    };
};

export const actualizarPerfilProfesional = async (repos, userId, data) => {
    const { sequelize, candidatoRepository, perfilRepository, candidatoPerfilRepository,
        habilidadBlandaRepository, candidatoHabilidadBlandaRepository,
        idiomaRepository, candidatoIdiomaRepository } = repos;

    const perfiles = data.perfiles || [];
    const habilidades = data.habilidadesBlandas || [];
    const idiomas = data.idiomas || [];

    if (perfiles.length === 0)
        throw new BadRequestError("Debes registrar al menos un perfil técnico");

    const transaction = await sequelize.transaction();
    try {
        const candidato = await candidatoRepository.findByUserId(userId, transaction);
        if (!candidato) throw new NotFoundError("Candidato no encontrado");

        await candidatoPerfilRepository.deleteByCandidatoId(candidato.id, transaction);
        await candidatoHabilidadBlandaRepository.deleteByCandidatoId(candidato.id, transaction);
        await candidatoIdiomaRepository.deleteByCandidatoId(candidato.id, transaction);

        // Perfiles técnicos
        const vistosP = new Set();
        for (const p of perfiles) {
            if (!p.perfil_id || !NIVELES_PERFIL.includes(p.nivel))
                throw new BadRequestError("Cada perfil técnico debe tener perfil y nivel válidos");
            if (vistosP.has(Number(p.perfil_id))) continue;
            vistosP.add(Number(p.perfil_id));
            if (!(await perfilRepository.findById(p.perfil_id)))
                throw new BadRequestError(`Perfil ${p.perfil_id} no existe`);
            await candidatoPerfilRepository.create(
                { candidato_id: candidato.id, perfil_id: p.perfil_id, nivel: p.nivel }, transaction);
        }

        // Habilidades blandas (existente por id, o nueva por nombre)
        const vistosH = new Set();
        for (const h of habilidades) {
            let hb;
            if (h.habilidad_blanda_id) {
                hb = await habilidadBlandaRepository.findById(h.habilidad_blanda_id);
                if (!hb) throw new BadRequestError(`Habilidad ${h.habilidad_blanda_id} no existe`);
            } else if (h.nombre?.trim()) {
                const nombre = h.nombre.trim();
                hb = await habilidadBlandaRepository.findByName(nombre)
                    || await habilidadBlandaRepository.create({ nombre }, transaction);
            } else {
                throw new BadRequestError("Cada habilidad debe tener un ID o un nombre");
            }
            if (vistosH.has(hb.id)) continue;
            vistosH.add(hb.id);
            await candidatoHabilidadBlandaRepository.create(
                { candidato_id: candidato.id, habilidad_blanda_id: hb.id }, transaction);
        }

        // Idiomas
        const vistosI = new Set();
        for (const i of idiomas) {
            if (!i.idioma_id || ![i.lee, i.habla, i.escucha].every(n => NIVELES_IDIOMA.includes(n)))
                throw new BadRequestError("Cada idioma debe tener niveles de lectura, habla y escucha válidos");
            if (vistosI.has(Number(i.idioma_id))) continue;
            vistosI.add(Number(i.idioma_id));
            if (!(await idiomaRepository.findById(i.idioma_id)))
                throw new BadRequestError(`Idioma ${i.idioma_id} no existe`);
            await candidatoIdiomaRepository.create({
                candidato_id: candidato.id, idioma_id: i.idioma_id,
                lee: i.lee, habla: i.habla, escucha: i.escucha
            }, transaction);
        }

        await transaction.commit();
        return { message: "Perfil profesional actualizado correctamente" };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};