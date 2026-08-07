import { DataTypes } from "sequelize";

const createRevisionInformeModel = (sequelize) => {
    const RevisionInforme = sequelize.define(
        "RevisionInforme",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            entrega_informe_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            usuario_revision_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            estado: {
                type: DataTypes.ENUM(
                    "Pendiente",
                    "Aprobado",
                    "Requiere_correccion"
                ),
                allowNull: false,
                defaultValue: "Pendiente",
            },

            comentario: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            fecha_revision: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: "RevisionInforme",
            freezeTableName: true,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: [
                        "entrega_informe_id",
                        "usuario_revision_id"
                    ]
                }
            ]
        }
    );

    return RevisionInforme;
};

export default createRevisionInformeModel;