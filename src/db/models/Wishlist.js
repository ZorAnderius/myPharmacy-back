import { Model, DataTypes } from 'sequelize';

/**
 * Represents a user's wishlist entry.
 * Stores a reference to a product a user is interested in.
 */
class Wishlist extends Model {
  /**
   * Initializes the Wishlist model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Wishlist} The initialized Wishlist model.
   */
  static initModel(sequelize) {
    return Wishlist.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
        product_id: { type: DataTypes.UUID, allowNull: false },
        createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
      },
      {
        sequelize,
        modelName: 'Wishlist',
        tableName: 'wishlists',
        timestamps: false,
        underscored: true,
        uniqueKeys: {
          unique_wishlist: {
            fields: ['user_id', 'product_id'],
          },
        },
      }
    );
  }

  /**
   * Defines model associations for Wishlist.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Wishlist.belongsTo(models.User, { foreignKey: 'user_id' });
    Wishlist.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

export default Wishlist;