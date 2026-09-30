import { DataTypes } from "sequelize";

const createSolicitudVisitaModel = (sequelize) => {

    const SolicitudVisita = sequelize.define(
        "SolicitudVisita",
        {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            empresa_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            tutor_docente_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            usuario_respuesta_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            fecha_respuesta: {
                type: DataTypes.DATE,
                allowNull: true,
            },

            estado: {
                type: DataTypes.ENUM(
                    "Pendiente",
                    "Aceptada",
                    "Rechazada",
                    "Cancelada"
                ),
                allowNull: false,
                defaultValue: "Pendiente",
            },

            observacion: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            fecha_creacion: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

        },
        {
            tableName: "SolicitudVisita",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return SolicitudVisita;
};

export default createSolicitudVisitaModel;