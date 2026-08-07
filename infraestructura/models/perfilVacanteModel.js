import { DataTypes } from "sequelize";

const createPerfilVacanteModel = (sequelize) => {
    const PerfilVacante = sequelize.define("PerfilVacante", {
        vacante_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Vacantes",
                key: "id"
            }
        },

        perfil_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Perfils",
                key: "id"
            }
        },

        nivel_minimo: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    return PerfilVacante;
};

export default createPerfilVacanteModel;