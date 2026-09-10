import { DataTypes } from "sequelize";

const createDepartamentoModel = (sequelize) => {

    const Departamento = sequelize.define(
        "Departamento",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },

            codigo: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true
            },

            nombre: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            }
        },
        {
            tableName: "Departamentos",
            freezeTableName: true,
            timestamps: false
        }
    );

    return Departamento;
};

export default createDepartamentoModel;