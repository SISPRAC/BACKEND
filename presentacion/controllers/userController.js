import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";
import { candidatoRepository } from "../../infraestructura/repositorios/candidatoRepositoryImpl.js";
import { PracticanteRepository } from "../../infraestructura/repositorios/practicanteRepositoryImpl.js";
import { departamentoRepository } from "../../infraestructura/repositorios/departamentoRepositoryImpl.js";
import { municipioRepository } from "../../infraestructura/repositorios/municipioRepositoryImpl.js";
import { TutorDocenteRepository } from "../../infraestructura/repositorios/tutorDocenteRepositoryImpl.js";
import { tutorEmpresaRepository } from "../../infraestructura/repositorios/TutorEmpresaRepositoryImpl.js"

import { cambiarEstadoUsuario } from "../../aplicacion/casos_de_uso/usuario/cambiarEstado.js";
import { actualizarPerfil } from "../../aplicacion/casos_de_uso/usuario/actualizarPerfil.js";


export const getUsers = async (req, res) => {
  try {

    const users = await userRepository.findAll();

    const usuariosFiltrados = users.filter(
      (user) => user.nombres !== "SISTEMA"
    );

    res.status(200).json(usuariosFiltrados);

  } catch (error) {

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


export const getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    // Candidato
    const candidato =
      await candidatoRepository.findByUserId(userId);

    let practicante = null;

    if (candidato) {
      practicante =
        await PracticanteRepository.findByCandidatoId(
          candidato.id
        );
    }

    // Tutor Docente
    const tutorDocente =
      await TutorDocenteRepository.findByUserId(userId);

    // Tutor Empresarial
    const tutorEmpresa =
      await tutorEmpresaRepository.findByUserId(userId);

    const usuario = user.toJSON();

    usuario.candidato = candidato
      ? {
        ...candidato.toJSON(),
        practicante: practicante
          ? practicante.toJSON()
          : null
      }
      : null;

    usuario.tutorDocente = tutorDocente
      ? tutorDocente.toJSON()
      : null;

    usuario.tutorEmpresa = tutorEmpresa
      ? tutorEmpresa.toJSON()
      : null;

    return res.status(200).json(usuario);

  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    console.log("Error de backend: ", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};


export const deleteUser = async (req, res) => {
  try {

    const deleted = await userRepository.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    res.status(200).json({
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {

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


export const updateUserRoles = async (req, res) => {
  try {

    const { id } = req.params;
    const { roles } = req.body;

    const user = await userRepository.updateRoles(id, roles);

    res.status(200).json(user);

  } catch (error) {

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    console.log("Error de backend: ", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};


export const cambiarEstado = async (req, res) => {
  try {

    const { id } = req.params;
    const { estado } = req.body;

    const usuario = await cambiarEstadoUsuario(
      { userRepository },
      id,
      estado
    );

    res.status(200).json({
      message: `Usuario ${estado.toLowerCase()} correctamente`,
      usuario
    });

  } catch (error) {

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    console.log("Error de backend: ", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};


export const actualizarPerfilUsuario = async (req, res) => {
  try {

    const rol = req.user.roles?.[0];

    const resultado = await actualizarPerfil(
      {
        userRepository,
        candidatoRepository,
        PracticanteRepository,
        TutorDocenteRepository,
        tutorEmpresaRepository,
        departamentoRepository,
        municipioRepository
      },
      req.user.id,
      req.body,
      rol
    );

    res.status(200).json(resultado);

  } catch (error) {

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    console.log("Error de backend: ", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};