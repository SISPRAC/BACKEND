
import { DataTypes } from "sequelize";

const createRecordatorioEnviadoModel = (sequelize) => {
    const RecordatorioEnviado = sequelize.define(
        "RecordatorioEnviado",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            tipo: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },

            referencia_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            fecha_envio: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "RecordatoriosEnviados",
            freezeTableName: true,
            timestamps: false,

            indexes: [
                {
                    unique: true,
                    fields: [
                        "tipo",
                        "referencia_id",
                        "usuario_id",
                    ],
                },
            ],
        }
    );

    return RecordatorioEnviado;
};

export default createRecordatorioEnviadoModel;
