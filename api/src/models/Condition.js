const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("conditions", {
    condition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
};
