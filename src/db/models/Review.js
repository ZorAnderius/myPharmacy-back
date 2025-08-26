import { Model, DataTypes } from 'sequelize';

/**
 * Represents a product review written by a user.
 * Stores rating and text feedback for a product.
 */
class Review extends Model {
  /**
   * Initializes the Review model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Review} The initialized Review model.
   */
  static initModel(sequelize) {
    return Review.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        content: { type: DataTypes.TEXT, allowNull: false },
        rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 10 } },
        product_id: { type: DataTypes.UUID, allowNull: false },
        user_id: { type: DataTypes.UUID, allowNull: false },
      },
      {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        timestamps: true,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Review.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Review.belongsTo(models.Product, { foreignKey: 'product_id' });
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default Review;
