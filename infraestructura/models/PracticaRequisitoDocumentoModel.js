import { DataTypes } from "sequelize";

const createPracticaRequisitoDocumentoModel = (sequelize) => {

    const PracticaRequisitoDocumento = sequelize.define(
        "PracticaRequisitoDocumento",
        {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            practica_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "Practicas",
                    key: "id"
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            rol_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "Roles",
                    key: "id"
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            descripcion: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: true,

                references: {
                    model: "Archivos",
                    key: "id"
                },

                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },

            fecha_inicio: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            fecha_limite: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },

            obligatorio: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },

            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }

        },
        {
            tableName: "PracticaRequisitoDocumento",
            freezeTableName: true,
            timestamps: false
        }
    );

    return PracticaRequisitoDocumento;
};

export default createPracticaRequisitoDocumentoModel;