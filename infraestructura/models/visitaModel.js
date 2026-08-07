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

            fecha_realizada: {
                type: DataTypes.DATE,
                allowNull: false,
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