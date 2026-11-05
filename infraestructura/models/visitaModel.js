import { DataTypes } from "sequelize";

const createVisitaModel = (sequelize) => {

    const Visita = sequelize.define(
        "Visita",
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

            fecha_visita: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            hora_visita: {
                type: DataTypes.TIME,
                allowNull: false,
            },

            fecha_realizada: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

        },
        {
            tableName: "Visita",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return Visita;
};

export default createVisitaModel;

