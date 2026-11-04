const { DataTypes } = require("sequelize");

const sequelize = require('../../../shared/database/connection')

const CategoryModel = sequelize.define("Category", 
  {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    superID: {
      type: DataTypes.INTEGER,
      allowNull: true, // Allows null because of `ON DELETE SET NULL`
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
)

CategoryModel.hasMany(CategoryModel, { foreignKey: 'superID', sourceKey: 'ID' });
CategoryModel.belongsTo(CategoryModel, { foreignKey: 'superID', targetKey: 'ID' });

module.exports = CategoryModel