import { DataTypes } from "sequelize";

const createFechaPropuestaVisitaModel = (sequelize) => {
    const FechaPropuestaVisita = sequelize.define(
        "FechaPropuestaVisita",
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

            usuario_propone_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            fecha_hora: {
                type: DataTypes.DATE,
                allowNull: false,
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

            fecha_respuesta: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "FechaPropuestaVisita",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return FechaPropuestaVisita;
};

export default createFechaPropuestaVisitaModel;