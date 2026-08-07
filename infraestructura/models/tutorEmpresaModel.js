import { DataTypes } from "sequelize";

const createTutorEmpresaModel = (sequelize) => {

    const TutorEmpresa = sequelize.define('TutorEmpresa', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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

        empresa_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Empresas",
                key: "id"
            },
        },

       cargo: {
            type: DataTypes.STRING,
            allowNull: false
        },

    }, {

        timestamps: false

    });

    return TutorEmpresa;
}

export default createTutorEmpresaModel;