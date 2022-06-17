const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("auctions", {
    date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    offer: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    cancel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  });
};
