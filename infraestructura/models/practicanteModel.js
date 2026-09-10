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
            perfil_completado: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            eps: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },

            codigoDepResidencia: {
                type: DataTypes.INTEGER,
                allowNull: true,

                references: {
                    model: "Departamentos",
                    key: "codigo"
                },

                onDelete: "RESTRICT",
                onUpdate: "CASCADE"
            },

            codigoMunResidencia: {
                type: DataTypes.INTEGER,
                allowNull: true,

                references: {
                    model: "Municipios",
                    key: "codigo"
                },

                onDelete: "RESTRICT",
                onUpdate: "CASCADE"
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