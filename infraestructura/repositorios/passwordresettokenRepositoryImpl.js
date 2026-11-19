import { models } from "../database/dbConnection.js";

export const passwordResetTokenRepository = {

    async create({ user_id, token_hash, expira_en }) {
        return await models.PasswordResetToken.create({
            user_id,
            token_hash,
            expira_en,
            usado: false
        });
    },

    async findByTokenHash(token_hash) {
        return await models.PasswordResetToken.findOne({
            where: {
                token_hash
            }
        });
    },

    async deleteByUserId(user_id) {
        return await models.PasswordResetToken.destroy({
            where: {
                user_id
            }
        });
    }
};