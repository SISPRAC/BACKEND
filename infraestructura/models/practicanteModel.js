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
                allowNull: false,
            },

            codigoDepResidencia: {
                type: DataTypes.CHAR(2),
                allowNull: false,
            },

            codigoMunResidencia: {
                type: DataTypes.CHAR(5),
                allowNull: false,
            },

            fecha_nacimiento: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            genero: {
                type: DataTypes.ENUM("Masculino", "Femenino", "Otro"),
                allowNull: false,
            },

            direccion: {
                type: DataTypes.STRING(255),
                allowNull: false,
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