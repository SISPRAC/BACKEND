import { DataTypes } from "sequelize";

const createMunicipioModel = (sequelize) => {

    const Municipio = sequelize.define(
        "Municipio",
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
                allowNull: false
            },

            departamento_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "Departamentos",
                    key: "id"
                },

                onDelete: "RESTRICT",
                onUpdate: "CASCADE"
            }
        },
        {
            tableName: "Municipios",
            freezeTableName: true,
            timestamps: false
        }
    );

    return Municipio;
};

export default createMunicipioModel;