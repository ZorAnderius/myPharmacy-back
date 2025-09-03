import { Model, DataTypes } from 'sequelize';

/**
 * Represents a specific product in an order.
 * Stores the product's quantity and price at the time of purchase.
 */
class OrderItem extends Model {
  /**
   * Initializes the OrderItem model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof OrderItem} The initialized OrderItem model.
   */
  static initModel(sequelize) {
    return OrderItem.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        order_id: { type: DataTypes.UUID, allowNull: false },
        product_id: { type: DataTypes.UUID, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { isDecimal: true, min: 0 } }, // Price at the time of purchase
      },
      {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for OrderItem.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'orders' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'products' });
  }
}

export default OrderItem;