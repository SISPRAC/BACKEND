import { DataTypes } from "sequelize";

const createPeriodoModel = (sequelize) => {
    const Periodo = sequelize.define('Periodo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: true

        },
        fecha_inicio: {
             type: DataTypes.DATEONLY,
            allowNull: false
        },

        fecha_fin: {
             type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return Periodo;
}

export default createPeriodoModel;