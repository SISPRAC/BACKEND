import SequelizePackage from "sequelize";
const { DataTypes } = SequelizePackage;

const createRolModel = (sequelize) => {
    const Rol = sequelize.define('Roles', {
        id:{ 
            type: DataTypes.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
       nombre: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }, 
    } ,{
  timestamps: false 
        } );
    return Rol;
}

export default createRolModel;