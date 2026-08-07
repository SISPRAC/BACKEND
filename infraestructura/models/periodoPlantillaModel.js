import { DataTypes } from "sequelize";


const createPeriodoPlantillaModel = (sequelize) => {


    const PeriodoPlantilla = sequelize.define('PeriodoPlantilla', {


        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },


        periodo_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Periodos",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },


        plantilla_encuesta_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "PlantillaEncuesta",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },


        version: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "1.0"
        },


        fecha_asignacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }


    }, {


        timestamps: false


    });


    return PeriodoPlantilla;

}


export default createPeriodoPlantillaModel;