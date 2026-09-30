import { DataTypes } from "sequelize";

const createSolicitudVisitaPracticanteModel = (sequelize) => {

    const SolicitudVisitaPracticante =
        sequelize.define(
            "SolicitudVisitaPracticante",
            {

                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                solicitud_visita_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

                practica_practicante_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },

            },
            {
                tableName: "SolicitudVisitaPracticante",
                freezeTableName: true,
                timestamps: false,
            }
        );

    return SolicitudVisitaPracticante;
};

export default createSolicitudVisitaPracticanteModel;