import { DataTypes } from "sequelize";

const createPracticanteModel = (sequelize) => {
    const Practicante = sequelize.define(
        "Practicante",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },

            candidato_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: "Candidatos",
                    key: "id",
                },
            },

            eps: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            codigoDepResidencia: {
                type: DataTypes.CHAR(2),
                allowNull: true,
            },

            codigoMunResidencia: {
                type: DataTypes.CHAR(5),
                allowNull: true,
            },

            fecha_nacimiento: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },

            genero: {
                type: DataTypes.ENUM(
                    "Masculino",
                    "Femenino",
                    "Otro"
                ),
                allowNull: true,
            },

            direccion: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            tableName: "Practicante",
            freezeTableName: true,
            timestamps: false,
        }
    );

    return Practicante;
};

export default createPracticanteModel;