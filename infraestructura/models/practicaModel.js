import { DataTypes } from "sequelize";

const createPracticaModel = (sequelize) => {
    const Practica = sequelize.define(
        "Practicas",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            fecha_inicio: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            fecha_fin: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            estado: {
                type: DataTypes.ENUM("EN_CURSO", "FINALIZADA"),
                allowNull: false,
                defaultValue: "EN_CURSO",
            },

            periodo_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Periodos",
                    key: "id"
                },
                onDelete: "RESTRICT",
                onUpdate: "CASCADE"
            }
        },
        {
            tableName: "Practicas",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return Practica;
};

export default createPracticaModel;