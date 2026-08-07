import { DataTypes } from "sequelize";

const createPerfilModel = (sequelize) => {
const Perfil = sequelize.define("Perfil", {
   id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
   },

   nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
   },

   descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
   }
},{
        timestamps: false
    });

return Perfil;
}

export default createPerfilModel;