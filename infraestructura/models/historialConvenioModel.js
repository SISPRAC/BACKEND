import { DataTypes } from "sequelize";

const createHistorialConvenioModel = (sequelize) => {

    const HistorialConvenio = sequelize.define(
        "Historial_Convenios",
        {

            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },


            convenio_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references: {
                    model: "Convenios",
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


            accion: {
                type: DataTypes.ENUM(
                    "CREADO",
                    "OBSERVACION",
                    "APROBADO",
                    "RECHAZADO",
                    "PENDIENTE"
                ),
                allowNull: false
            },


            fecha: {
                type: DataTypes.DATE,
                allowNull: false
            },


            comentario: {
                type: DataTypes.TEXT,
                allowNull: true
            },


            usuario_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

                references:{
                    model:"Usuarios",
                    key:"id"
                }
            }

        },
        {
            timestamps:false
        }
    );


    return HistorialConvenio;

};


export default createHistorialConvenioModel;