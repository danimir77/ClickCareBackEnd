const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("professionals", {
    // id_user: {
    //   type: DataTypes.INTEGER,
    // },
    tuition: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    trainings: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },

    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cvu: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    balance: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  });
};
