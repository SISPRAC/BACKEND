import { DataTypes } from "sequelize";

const createEntregaInformeModel = (sequelize) => {
    const EntregaInforme = sequelize.define(
        "EntregaInforme",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            practica_informe_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            version: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },

            fecha_entrega: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "EntregaInforme",
            freezeTableName: true,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["practica_informe_id", "version"],
                },
            ],
        }
    );

    return EntregaInforme;
};

export default createEntregaInformeModel;