import { DataTypes } from "sequelize";

const createArchivoModel = (sequelize) => {

    const Archivo = sequelize.define(
        "Archivos",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            url: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            public_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            resource_type: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: "auto",
            },

            fecha_subida: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "Archivos",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return Archivo;
};

export default createArchivoModel;