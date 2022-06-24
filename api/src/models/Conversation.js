const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "conversations",
    {
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senderImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      receiverName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      receiverImg: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );
};
