import { Model, DataTypes } from 'sequelize';
import { orderStatuses } from '../../constants/inputVars.js';

/**
 * Represents the status of an order.
 * Stores predefined values like "Pending", "Shipped", "Delivered".
 */
class OrderStatus extends Model {
  /**
   * Initializes the OrderStatus model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof OrderStatus} The initialized OrderStatus model.
   */
  static initModel(sequelize) {
    return OrderStatus.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { isIn: [orderStatuses] },
        },
      },
      {
        sequelize,
        modelName: 'OrderStatus',
        tableName: 'order_statuses',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for OrderStatus.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    OrderStatus.hasMany(models.Order, { foreignKey: 'status_id' });
  }
}

export default OrderStatus;