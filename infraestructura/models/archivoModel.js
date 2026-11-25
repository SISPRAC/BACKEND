import SequelizePackage from "sequelize";
const { DataTypes } = SequelizePackage;

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

            // ---------- ARCHIVADO EN DRIVE ----------
            // true = la copia local se borró y el archivo solo vive en Drive.
            // La URL (/uploads/...) no cambia: el backend lo trae de Drive al pedirlo.
            archivado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            drive_file_id: { type: DataTypes.STRING(100), allowNull: true },
            fecha_archivado: { type: DataTypes.DATE, allowNull: true },
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