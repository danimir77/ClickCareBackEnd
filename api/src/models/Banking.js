const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("bankings", {
    cvu: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alias: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
