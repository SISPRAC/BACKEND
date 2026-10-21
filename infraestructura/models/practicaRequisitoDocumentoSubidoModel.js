import { DataTypes } from "sequelize";

const createPracticaRequisitoDocumentoSubidoModel = (sequelize) => {
    const PracticaRequisitoDocumentoSubido = sequelize.define(
        "PracticaRequisitoDocumentoSubido",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            practica_requisito_documento_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            estado: {
                type: DataTypes.ENUM(
                    "PENDIENTE",
                    "APROBADO",
                    "RECHAZADO"
                ),
                allowNull: false,
                defaultValue: "PENDIENTE",
            },

            observacion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            fecha_subida: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            fecha_revision: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            usuario_revision_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            fecha_vencimiento: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
        },
        {
            tableName: "PracticaRequisitoDocumentoSubidos",
            timestamps: false,
        }
    );

    return PracticaRequisitoDocumentoSubido;
};

export default createPracticaRequisitoDocumentoSubidoModel;