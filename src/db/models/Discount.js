import { Model, DataTypes } from 'sequelize';

/**
 * Represents a discount applied to a specific product.
 * Stores discount code, percentage, and validity period.
 */
class Discount extends Model {
  /**
   * Initializes the Discount model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Discount} The initialized Discount model.
   */
  static initModel(sequelize) {
    return Discount.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        code: { type: DataTypes.STRING, allowNull: false, unique: true },
        percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0.0, validate: { isFloat: true, min: 0.0 } },
        start_date: { type: DataTypes.DATE, allowNull: false },
        end_date: { type: DataTypes.DATE, allowNull: false },
        product_id: { type: DataTypes.UUID, allowNull: false },
      },
      {
        sequelize,
        modelName: 'Discount',
        tableName: 'discounts',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Discount.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Discount.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

export default Discount;
