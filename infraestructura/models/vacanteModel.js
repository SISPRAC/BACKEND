import { DataTypes } from 'sequelize';

const createVacanteModel = (sequelize) => {

    const Vacante = sequelize.define('Vacante', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        convenio_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Convenios",
                key: "id"
            }
        },

        nombre: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: false
        },

        descripcion: {
            type: DataTypes.STRING,
            allowNull: false
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        estado: {
            type: DataTypes.ENUM(
                'DISPONIBLE',
                'CERRADA'
            ),
            allowNull: false,
            defaultValue: 'DISPONIBLE'
        }

    }, {
        timestamps: false
    });

    return Vacante;
}

export default createVacanteModel;