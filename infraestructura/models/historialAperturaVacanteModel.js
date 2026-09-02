import { DataTypes } from "sequelize";

const createHistorialAperturaVacanteModel = (sequelize) => {
    const HistorialAperturaVacante = sequelize.define(
        "HistorialAperturaVacante",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            apertura_vacante_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "AperturaVacantes",
                    key: "id"
                }
            },

            cupos_anterior: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            cupos_nuevo: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            fecha_cambio: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
        },
        {
            timestamps: false
        }
    );

    return HistorialAperturaVacante;
};

export default createHistorialAperturaVacanteModel;