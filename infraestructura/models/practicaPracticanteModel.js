import SequelizePackage from "sequelize";
const { DataTypes } = SequelizePackage;

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

            objetivo: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            certificado_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },

            certificado_subido_por: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },

            certificado_fecha_subida: {
                type: DataTypes.DATE,
                allowNull: true,
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