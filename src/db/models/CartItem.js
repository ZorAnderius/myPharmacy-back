import { Model, DataTypes } from 'sequelize';

/**
 * Represents an item inside a shopping cart.
 * Links a product to a specific cart with a quantity.
 */
class CartItem extends Model {
  /**
   * Initializes the CartItem model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof CartItem} The initialized CartItem model.
   */
  static initModel(sequelize) {
    return CartItem.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        cart_id: { type: DataTypes.UUID, allowNull: false },
        product_id: { type: DataTypes.UUID, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      },
      {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cart_items',
        timestamps: true,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for CartItem.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id' });
    CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

export default CartItem;
