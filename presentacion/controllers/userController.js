import { userRepository } from "../../infraestructura/repositorios/userRepositoryImpl.js";

export const getUsers = async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.status(200).json(users);
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
    console.log("datos de entrada: ", req);
    const user = await userRepository.findBycorreo(req.user.correo);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(user);
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

export const deleteUser = async (req, res) => {
  try {
    const deleted = await userRepository.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" });
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