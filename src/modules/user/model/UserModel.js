const { DataTypes } = require("sequelize");
const sequelize = require("../../../shared/database/connection");

const UserModel = sequelize.define(
  "Customer",
  {
    userID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        is: /^[^@]+@gmail\.com$/i, // Ensures the email ends with @gmail.com
      },
    },
    hashPassword: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phoneNum: {
      type: DataTypes.CHAR(10),
      validate: {
        isNumeric: true, // Ensures the value contains only numbers
      },
    },
    province: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    userAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdTime: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    bankAccount: {
      type: DataTypes.CHAR(10),
      validate: {
        isNumeric: true, // Ensures the value contains only numbers
      },
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = UserModel;