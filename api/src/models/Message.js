const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "messages",
    {
      conversationId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
