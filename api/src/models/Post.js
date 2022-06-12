const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("posts", {
    date_post: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    hour_post: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_ini: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    date_fin: {
      type: DataTypes.DATEONLY,
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
  });
};
