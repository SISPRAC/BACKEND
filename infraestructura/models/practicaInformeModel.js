import { DataTypes } from "sequelize";

const createPracticaInformeModel = (sequelize) => {

    const PracticaInforme = sequelize.define(
        "PracticaInforme",
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

            tipo_informe_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "TipoInforme",
                    key: "id"
                },

                onDelete: "CASCADE",
                onUpdate: "CASCADE"
            },

            fecha_inicio: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            fecha_limite: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },

            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            tableName: "PracticaInforme",
            freezeTableName: true,
            timestamps: false,

            indexes: [
                {
                    unique: true,
                    fields: [
                        "practica_id",
                        "tipo_informe_id"
                    ]
                }
            ]
        }
    );

    return PracticaInforme;
};

export default createPracticaInformeModel;