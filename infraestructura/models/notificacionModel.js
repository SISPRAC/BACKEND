import { DataTypes } from "sequelize";

const createNotificacionModel = (sequelize) => {

    const Notificacion = sequelize.define(
        "Notificaciones",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            titulo: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            descripcion: {
                type: DataTypes.TEXT,
                allowNull: false,
            },

            estado: {
                type: DataTypes.ENUM(
                    "SIN_LEER",
                    "LEIDA"
                ),
                allowNull: false,
                defaultValue: "SIN_LEER",
            },

            fecha_creacion: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "Notificaciones",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return Notificacion;
};

export default createNotificacionModel;