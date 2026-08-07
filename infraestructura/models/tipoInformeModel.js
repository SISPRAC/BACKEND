import { DataTypes } from "sequelize";

const createTipoInformeModel = (sequelize) => {
    const TipoInforme = sequelize.define(
        "TipoInforme",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },

            archivo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "TipoInforme",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return TipoInforme;
};

export default createTipoInformeModel;