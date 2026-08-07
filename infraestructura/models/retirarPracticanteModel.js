import { DataTypes } from "sequelize";

const createRetiroPracticanteModel = (sequelize) => {
    const RetiroPracticante = sequelize.define(
        "RetiroPracticante",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            fecha_retiro: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            motivo: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Usuarios",
                    key: "id",
                },
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "Archivos",
                    key: "id",
                },
            },
        },
        {
            tableName: "RetiroPracticante",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return RetiroPracticante;
};

export default createRetiroPracticanteModel;