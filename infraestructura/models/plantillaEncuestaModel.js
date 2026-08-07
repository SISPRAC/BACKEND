import { DataTypes } from "sequelize";

const createPlantillaEncuestaModel = (sequelize) => {

    const PlantillaEncuesta = sequelize.define('PlantillaEncuesta', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        rol_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Roles",
                key: "id"
            },

            onDelete: "CASCADE",
            onUpdate: "CASCADE" 
        },

        titulo: {
            type: DataTypes.STRING,
            allowNull: false
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },

        activa: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        fecha_creacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    }, {

        timestamps: false

    });


    return PlantillaEncuesta;

}


export default createPlantillaEncuestaModel;