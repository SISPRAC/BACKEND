import { DataTypes } from "sequelize";

const createEntregaInformeModel = (sequelize) => {

    const EntregaInforme = sequelize.define(
        "EntregaInforme",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            practica_requisito_documento_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "PracticaRequisitoDocumento",
                    key: "id"
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            practica_practicante_id: {
                type: DataTypes.INTEGER, 
                allowNull: false,

                references: {
                    model: "PracticaPracticante",
                    key: "id"
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "Archivos",
                    key: "id"
                },

                onDelete: "RESTRICT",
                onUpdate: "CASCADE"
            },

            version: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },

            fecha_entrega: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },

            estado_tutor_docente: {
                type: DataTypes.ENUM(
                    "PENDIENTE",
                    "APROBADO",
                    "RECHAZADO",
                    "COMENTADO",
                    "ACTUALIZADO"
                ),
                allowNull: false,
                defaultValue: "PENDIENTE"
            },

            tutor_docente_id: {
                type: DataTypes.INTEGER,
                allowNull: true,

                references: {
                    model: "TutorDocentes",
                    key: "id"
                },

                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },

            fecha_revision_tutor_docente: {
                type: DataTypes.DATE,
                allowNull: true
            },

            observacion_tutor_docente: {
                type: DataTypes.TEXT,
                allowNull: true
            },

            estado_tutor_empresarial: {
                type: DataTypes.ENUM(
                    "PENDIENTE",
                    "APROBADO",
                    "RECHAZADO"
                ),
                allowNull: false,
                defaultValue: "PENDIENTE"
            },

            tutor_empresarial_id: {
                type: DataTypes.INTEGER,
                allowNull: true,

                references: {
                    model: "TutorEmpresas",
                    key: "id"
                },

                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },

            fecha_revision_tutor_empresarial: {
                type: DataTypes.DATE,
                allowNull: true
            },

            observacion_tutor_empresarial: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        },
        {
            tableName: "EntregaInforme",
            freezeTableName: true,
            timestamps: false,

            indexes: [
                {
                    name: "entrega_informe_version_unica",
                    unique: true,
                    fields: [
                        "practica_practicante_id",
                        "practica_requisito_documento_id",
                        "version"
                    ]
                }
            ]
        }
    );

    return EntregaInforme;
};

export default createEntregaInformeModel;