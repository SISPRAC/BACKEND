import { DataTypes } from "sequelize";

const createPasswordResetTokenModel = (sequelize) => {

    const PasswordResetToken = sequelize.define("PasswordResetToken", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Usuarios",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        token_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true
        },

        expira_en: {
            type: DataTypes.DATE,
            allowNull: false
        },

        usado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }

    }, {
        tableName: "password_reset_tokens",
        timestamps: true
    });

    return PasswordResetToken;
};

export default createPasswordResetTokenModel;