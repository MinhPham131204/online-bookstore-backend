const { DataTypes } = require("sequelize");
const sequelize = require('../database/configDB')

const OrderModel = require('./OrderModel')
const BookModel = require('../../catalog/models/BookModel')

const OrderDetailModel = sequelize.define("OrderDetail", 
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderID: {
      type: DataTypes.INTEGER,
      allowNull: false, // Allows null because of `ON DELETE SET NULL`
      references: {
        model: OrderModel, // Name of the related table
        sourceKey: "orderID",
      },
      onDelete: "CASCADE", // Aligns with `ON DELETE SET NULL`
      onUpdate: "CASCADE", // Aligns with `ON UPDATE CASCADE`
    },
    bookID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BookModel, // Name of the related table
        sourceKey: "bookID",
      },
      onDelete: "CASCADE", // Aligns with `ON DELETE CASCADE`
      onUpdate: "CASCADE", // Aligns with `ON UPDATE CASCADE`
    },
    quantity: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        min: 1, // Ensures quantity is greater than 0
      },
    },
    price: {
      type: DataTypes.DECIMAL(19, 4),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
)

OrderModel.hasMany(OrderDetailModel, { foreignKey: "orderID" });
OrderDetailModel.belongsTo(OrderModel, { foreignKey: "orderID" });

BookModel.hasMany(OrderDetailModel, { foreignKey: "bookID" });
OrderDetailModel.belongsTo(BookModel, { foreignKey: "bookID" });

module.exports = OrderDetailModel