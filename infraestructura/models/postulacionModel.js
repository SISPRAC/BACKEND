import { DataTypes } from "sequelize";

const createPostulacionModel = (sequelize) => {
    const Postulacion = sequelize.define('Postulacion', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
         estado: {
            type: DataTypes.ENUM(
                'POSTULADO',
                'ACEPTADO',
                'RECHAZADO',
                'RETIRADO'
            ),
            allowNull: false,
            defaultValue: 'POSTULADO'
        },

        comentarioEmpresa: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        fecha_eleccion: {
             type: DataTypes.DATEONLY,
            allowNull: true
        },
        candidato_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
             references: {
                model: "Candidatos",
                key: "id"
            },
            },

        aperturaVacante_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "AperturaVacantes",
                key: "id"
            }
        }

    }, {
        timestamps: true,
        createdAt: 'fecha_postulacion',
        updatedAt: false
    });

    return Postulacion;
}

export default createPostulacionModel;