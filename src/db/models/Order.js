import { Model, DataTypes } from 'sequelize';

class Order extends Model {
  static initModel(sequelize) {
    return Order.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        total_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        status_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate(models) {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.belongsTo(models.OrderStatus, { foreignKey: 'status_id' });
  }
}

export default Order;
