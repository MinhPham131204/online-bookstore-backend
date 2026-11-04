const { DataTypes, Sequelize } = require("sequelize");
const sequelize = require('../../../shared/database/connection');

const UserModel = require('../../user/models/UserModel')

const OrderModel = sequelize.define("Orders", 
  {
    orderID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel, // Name of the related table
        sourceKey: 'userID',
      },
      onDelete: 'CASCADE', // Aligns with `ON DELETE CASCADE`
      onUpdate: 'CASCADE', // Aligns with `ON UPDATE CASCADE`
    },
    province: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    orderAddress: {
      type: DataTypes.TEXT, 
    },
    deliveryStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isIn: {
          args: [['Đang vận chuyển', 'Đã giao hàng', 'Đã hủy']],
          msg: 'Invalid delivery status',
        },
      },
      defaultValue: 'Đang vận chuyển',
    },
    orderedTime: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("GETDATE()"),
    },
    paymentMethod: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isIn: {
          args: [['Thanh toán trực tiếp', 'Ví điện tử', 'Internet Banking']],
          msg: 'Invalid payment method',
        },
      },
      defaultValue: 'Thanh toán trực tiếp',
    },
    paymentDate: {
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
)

UserModel.hasMany(OrderModel, { foreignKey: 'customerID' })
OrderModel.belongsTo(UserModel, { foreignKey: 'customerID' })

module.exports = OrderModel