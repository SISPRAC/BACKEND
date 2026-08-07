import { DataTypes } from "sequelize";

const createUserRolModel = (sequelize) => {

    return sequelize.define("Usuarios_roles", {

        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "Usuarios",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: "Roles",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

    }, {
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["user_id", "role_id"]
            }
        ]
    });
};

export default createUserRolModel;