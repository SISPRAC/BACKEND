import { DataTypes } from "sequelize";

const createIdiomaModel = (sequelize) => {

    const Idioma = sequelize.define("Idioma", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }

    }, {
        timestamps: false
    });

    return Idioma;
};

export default createIdiomaModel;