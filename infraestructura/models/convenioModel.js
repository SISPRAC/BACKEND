import { DataTypes } from "sequelize";

const createConvenioModel = (sequelize) => {
    const Convenio = sequelize.define('Convenio', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        empresa_id: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: "Empresas",
                key: "id"
            }
        },
        archivo_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "Archivos",
                key: "id"
            }
        },
        estado: {
            type: DataTypes.ENUM(
                'APROBADO',
                'PENDIENTE',
                'OBSERVACION',
                'ACTUALIZADO',
                'RECHAZADO'),
            allowNull: false,
            defaultValue: 'PENDIENTE'
        },

        fecha_inicio: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        fecha_fin: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        fecha_envio: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        timestamps: false,
    });

    return Convenio;
}

export default createConvenioModel;