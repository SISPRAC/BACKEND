import { DataTypes } from "sequelize";

const createTipoInformeModel = (sequelize) => {

    const TipoInforme = sequelize.define(
        "TipoInforme",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },

            descripcion: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: true,

                references: {
                    model: "Archivos",
                    key: "id"
                },

                onDelete: "SET NULL",
                onUpdate: "CASCADE"
            },

            estado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        },
        {
            tableName: "TipoInforme",
            freezeTableName: true,
            timestamps: false
        }
    );

    return TipoInforme;
};

export default createTipoInformeModel;