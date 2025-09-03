import { Model, DataTypes } from 'sequelize';

/**
 * Represents a customer's order.
 * Contains details about total price, status, and creation date.
 */
class Order extends Model {
  /**
   * Initializes the Order model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Order} The initialized Order model.
   */
  static initModel(sequelize) {
    return Order.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        order_number: { type: DataTypes.TEXT, allowNull: false, unique: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
        total_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, validate: { isDecimal: true, min: 0 } },
      },
      {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: true,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Order.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Order.belongsTo(models.User, { foreignKey: 'user_id' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', onDelete: 'CASCADE', as: 'orderItems' });
  }
}

export default Order;
