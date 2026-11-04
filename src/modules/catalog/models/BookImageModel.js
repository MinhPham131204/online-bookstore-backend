const { DataTypes } = require("sequelize");
const sequelize = require('../../../shared/database/connection');

const BookModel = require('./BookModel')

const BookImageModel = sequelize.define("bookImage",
  {
    bookID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: BookModel,
        key: 'bookID',
      },
      onDelete: 'CASCADE', 
      onUpdate: 'CASCADE', 
    },
    image: {
      type: DataTypes.STRING(255), 
      allowNull: false,
      primaryKey: true,
    },
    ssn: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
)

BookModel.hasMany(BookImageModel, { foreignKey: 'bookID' });
BookImageModel.belongsTo(BookModel, { foreignKey: 'bookID' });

module.exports = BookImageModel