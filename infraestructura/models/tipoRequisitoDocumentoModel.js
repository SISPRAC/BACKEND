import { DataTypes } from "sequelize";

const createTipoRequisitoDocumentoModel = (sequelize) => {

    const TipoRequisitoDocumento = sequelize.define(
        "TipoRequisitoDocumento",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },

            descripcion: {
                type: DataTypes.STRING(255),
                allowNull: true
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
            tableName: "TipoRequisitoDocumento",
            freezeTableName: true,
            timestamps: false
        }
    );

    return TipoRequisitoDocumento;
};

export default createTipoRequisitoDocumentoModel;