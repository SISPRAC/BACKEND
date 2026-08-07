import { DataTypes } from "sequelize";

const createCandidatoModel = (sequelize) => {

    const Candidato = sequelize.define('Candidato', {

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

        codigo: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: false
        },

        hoja_vida_archivo_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Archivos",
                key: "id"
            },
            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        },

        grupo_id: {
            type: DataTypes.INTEGER,
            allowNull: true,

            references: {
                model: "Grupos",
                key: "id"
            },

            onDelete: "SET NULL",
            onUpdate: "CASCADE"
        }

    }, {

        timestamps: false

    });

    return Candidato;
}

export default createCandidatoModel;