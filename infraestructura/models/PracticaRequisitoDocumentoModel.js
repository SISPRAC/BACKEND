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

            tipo_requisito_documento_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "TipoRequisitoDocumento",
                    key: "id"
                },

                onDelete: "CASCADE",
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

            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            tableName: "PracticaRequisitoDocumento",
            freezeTableName: true,
            timestamps: false,

            indexes: [
                {
                    name: "practica_requisito_documento_unico",
                    unique: true,
                    fields: [
                        "practica_id",
                        "tipo_requisito_documento_id"
                    ]
                }
            ]
        }
    );

    return PracticaRequisitoDocumento;
};

export default createPracticaRequisitoDocumentoModel;