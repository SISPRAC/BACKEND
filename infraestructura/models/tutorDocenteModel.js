import { DataTypes } from "sequelize";

const createTutorDocenteModel = (sequelize) => {

    const TutorDocente = sequelize.define("TutorDocente", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        usuario_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Usuarios",
                key: "id"
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        },

        codigo: {
            type: DataTypes.STRING(8),
            allowNull: false,
            unique: true
        }

    }, {
        timestamps: false
    });

    return TutorDocente;
}

export default createTutorDocenteModel;