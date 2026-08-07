import { DataTypes } from "sequelize";

const createGrupoModel = (sequelize) => {
    const Grupo = sequelize.define("Grupo", {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },

    periodo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Periodos",
            key: "id"
        }
    },

    tutorDocente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "TutorDocentes",
            key: "id"
        }
    }
}, {
        timestamps: false
    });

    return Grupo;
};

export default createGrupoModel;