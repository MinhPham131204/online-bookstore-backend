const { DataTypes } = require("sequelize");
const sequelize = require('../../../shared/database/connection');

const UserModel = require('../../user/models/UserModel')
const BookModel = require('../../catalog/models/BookModel')

const CartModel = sequelize.define("Cart", 
  {
    customerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: UserModel, // Name of the related table
        sourceKey: 'userID',
      },
      onDelete: 'CASCADE', // Aligns with `ON DELETE CASCADE`
      onUpdate: 'CASCADE', // Aligns with `ON UPDATE CASCADE`
    },
    bookID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      references: {
        model: BookModel, // Name of the related table
        sourceKey: 'bookID',
      },
      onDelete: 'SET NULL', // Aligns with `ON DELETE SET NULL`
      onUpdate: 'CASCADE', // Aligns with `ON UPDATE CASCADE`
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Ensures quantity is at least 1
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
)

UserModel.hasMany(CartModel, { foreignKey: 'customerID' })
CartModel.belongsTo(UserModel, { foreignKey: 'customerID' })

BookModel.hasMany(CartModel, { foreignKey: 'bookID' })
CartModel.belongsTo(BookModel, { foreignKey: 'bookID' })

module.exports = CartModel