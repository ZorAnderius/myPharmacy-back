import { Model, DataTypes } from 'sequelize';

/**
 * Represents a shopping cart belonging to a specific user.
 * Contains items the user intends to purchase.
 */
class Cart extends Model {
  
  /**
   * Initializes the Cart model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Cart} The initialized Cart model.
   */
  static initModel(sequelize) {
    return Cart.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
      },
      {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Cart.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
  }
}

export default Cart;