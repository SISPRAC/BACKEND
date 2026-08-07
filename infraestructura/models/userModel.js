import { DataTypes } from "sequelize";

const createUserModel = (sequelize) => {

    const User = sequelize.define('Usuario', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombres: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        apellidos: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        correo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        tipo_documento: {
            type: DataTypes.ENUM('CC', 'CE', 'PEP', 'PA'),
            allowNull: false
        },

        cedula: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true
        },

        telefono: {
            type: DataTypes.STRING(15),
            allowNull: false
        }

    }, {
        timestamps: false
    });

    return User;
}

export default createUserModel;