const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "professionals",
    {
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
      nivelDeEstudio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      institucion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_inicioEstudio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date_finicioEstudio: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );
};
