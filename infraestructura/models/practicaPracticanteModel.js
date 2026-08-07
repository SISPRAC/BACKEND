import { DataTypes } from "sequelize";

const createPracticaPracticanteModel = (sequelize) => {
    const PracticaPracticante = sequelize.define(
        "PracticaPracticante",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            practica_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            practicante_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            estado: {
                type: DataTypes.ENUM(
                    "En curso",
                    "Finalizada",
                    "Retirado",
                    "Cancelado"
                ),
                allowNull: false,
                defaultValue: "En curso",
            },
        },
        {
            tableName: "PracticaPracticante",
            freezeTableName: true,
            timestamps: false,
              indexes: [
        {
            unique: true,
            fields: ["practica_id", "practicante_id"],
        },
    ],
        }
    );

    return PracticaPracticante;
};

export default createPracticaPracticanteModel;