import { DataTypes } from "sequelize";

const createAperturaVacanteModel = (sequelize) => {

    const AperturaVacante = sequelize.define('AperturaVacante', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        vacante_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Vacantes",
                key: "id"
            }
        },

        tutorEmpresa_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "TutorEmpresas",
                key: "id"
            }
        },
        practica_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Practicas",
                key: "id"
            }
        },
        cupos: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        estado: {
            type: DataTypes.ENUM(
                'DISPONIBLE',
                'OCUPADA',
                'CERRADA'),
            allowNull: false,
            defaultValue: 'DISPONIBLE'
        },


    }, {

        timestamps: false

    });

    return AperturaVacante;
}

export default createAperturaVacanteModel;