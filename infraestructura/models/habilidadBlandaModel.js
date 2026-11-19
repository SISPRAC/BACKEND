import { DataTypes } from "sequelize";

const createHabilidadBlandaModel = (sequelize) => {

    const HabilidadBlanda = sequelize.define("HabilidadBlanda", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(80),
            allowNull: false,
            unique: true
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        }

    }, {
        timestamps: false
    });

    return HabilidadBlanda;
};

export default createHabilidadBlandaModel;