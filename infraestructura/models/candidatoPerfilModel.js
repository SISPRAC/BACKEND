import { DataTypes } from "sequelize";

const createCandidatoPerfilModel = (sequelize) => {

   const CandidatoPerfil = sequelize.define("Candidato_perfil", {

      candidato_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "Candidatos",
            key: "id"
         }
      },

      perfil_id: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
            model: "Perfils",
            key: "id"
         }
      },

      calificacion: {
         type: DataTypes.INTEGER,
         allowNull: false,
         validate: {
            min: 1,
            max: 5
         }
      }

   }, {
      timestamps: false,
   indexes: [
      {
         unique: true,
         fields: ["candidato_id", "perfil_id"]
      }
   ]
});

   return CandidatoPerfil;
}

export default createCandidatoPerfilModel;