import e from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../../../shared/errors/BadRequestError.js";

export const refreshTokenUseCase = async (userRepository, token) => {

    if (!token) {
        throw new BadRequestError("NO_TOKEN");
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await userRepository.findById(decoded.id);

    if (!user) {
        throw new BadRequestError("USER_NOT_FOUND");
    }

    const newAccessToken = jwt.sign(
        { id: user.id, roles: user.roles },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
    );

    return {
        accessToken: newAccessToken,
        user
    };
};

export default refreshTokenUseCase;

export const generateInvitationToken = (rol) => {
  const payload = { rol }; 
  const secret = process.env.JWT_SECRET; 
  const options = { expiresIn: "1d" }; 

  return jwt.sign(payload, secret, options);
};
