const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("posts", {
    date_post: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    hour_post: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_ini: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    date_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    needs: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },

    locationReference: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availableTime_0: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    availableTime_1: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    agePatient: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    namePatient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    addressPatient: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
