import { DataTypes } from "sequelize";

const createEmpresaModel = (sequelize) => {

    const Empresa = sequelize.define("Empresa", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nit: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        direccion: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        logo: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        // NUEVO
        logo_public_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Usuarios",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

    }, {
        timestamps: false
    });

    return Empresa;
};

export default createEmpresaModel;