import { DataTypes } from "sequelize";

const createEmpresaRequisitoDocumentoModel = (sequelize) => {

    const EmpresaRequisitoDocumento = sequelize.define(
        "EmpresaRequisitoDocumento",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            empresa_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "Empresas", key: "id" },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            tipo_requisito_documento_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: { model: "TipoRequisitoDocumento", key: "id" },
                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: { model: "Archivos", key: "id" },
                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },

            estado: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: "PENDIENTE"
            },

            observacion: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            fecha_subida: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: "EmpresaRequisitoDocumento",
            freezeTableName: true,
            timestamps: false
        }
    );

    return EmpresaRequisitoDocumento;
};

export default createEmpresaRequisitoDocumentoModel;