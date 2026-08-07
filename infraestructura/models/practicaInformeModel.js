import { DataTypes } from "sequelize";

const createPracticaInformeModel = (sequelize) => {
    const PracticaInforme = sequelize.define(
        "PracticaInforme",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            practica_practicante_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            tipo_informe_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            fecha_limite: {
                type: DataTypes.DATE,
                allowNull: false,
            },

        },
        {
            tableName: "PracticaInforme",
            freezeTableName: true,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: [
                        "practica_practicante_id",
                        "tipo_informe_id",
                    ],
                },
            ],
        }
    );

    return PracticaInforme;
};

export default createPracticaInformeModel;