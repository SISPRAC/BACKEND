import { DataTypes } from "sequelize";

const createSolicitudVisitaFechaModel = (sequelize) => {

    const SolicitudVisitaFecha =
        sequelize.define(
            "SolicitudVisitaFecha",
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

                fecha_inicio: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                },

                fecha_fin: {
                    type: DataTypes.DATEONLY,
                    allowNull: false,
                },

                hora_inicio: {
                    type: DataTypes.TIME,
                    allowNull: false,
                },

                hora_fin: {
                    type: DataTypes.TIME,
                    allowNull: false,
                },

                seleccionada: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },

            },
            {
                tableName: "SolicitudVisitaFecha",
                freezeTableName: true,
                timestamps: false,
            }
        );

    return SolicitudVisitaFecha;
};

export default createSolicitudVisitaFechaModel;