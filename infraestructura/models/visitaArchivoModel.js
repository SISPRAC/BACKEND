import { DataTypes } from "sequelize";

const createVisitaArchivoModel = (sequelize) => {
    const VisitaArchivo = sequelize.define(
        "VisitaArchivo",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            visita_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            tipo: {
                type: DataTypes.ENUM(
                    "Acta",
                    "Fotografia",
                    "Video",
                    "Otro"
                ),
                allowNull: false,
            },
        },
        {
            tableName: "VisitaArchivo",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return VisitaArchivo;
};

export default createVisitaArchivoModel;