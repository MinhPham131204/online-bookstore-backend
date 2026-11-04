const { DataTypes } = require("sequelize");

const sequelize = require('../../../shared/database/connection')
const CategoryModel = require("./CategoryModel")

const BookModel = sequelize.define("Book", 
  {
    bookID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING, // `nvarchar(max)` maps to Sequelize's TEXT type
      allowNull: false,
      unique: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    translator: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: CategoryModel,
        sourceKey: "ID",
      },
      onDelete: 'SET NULL', // Reflects 'on delete set null'
      onUpdate: 'CASCADE', // Reflects 'on update cascade'
    },
    price: {
      type: DataTypes.DECIMAL(19, 4), // `money` in SQL maps to DECIMAL
      allowNull: false,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publishYear: {
      type: DataTypes.CHAR(4),
      allowNull: false,
      validate: {
        is: /^[1-2][0-9]{3}$/, // Ensures valid year format
      },
    },
    numOfPages: {
      type: DataTypes.SMALLINT,
    },
    bookWeight: {
      type: DataTypes.SMALLINT,
    },
    soldAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0, // Ensures stockQuantity >= 0
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
)

CategoryModel.hasMany(BookModel, { foreignKey: "categoryID" })
BookModel.belongsTo(CategoryModel, { foreignKey: "categoryID" })

module.exports = BookModel