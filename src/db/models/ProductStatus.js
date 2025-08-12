import { Model, DataTypes } from 'sequelize';
import { productStatuses } from '../../constants/inputVars.js';

/**
 * Represents the status of a product.
 * Stores predefined values like "Available", "Out of Stock", "Discontinued".
 */
class ProductStatus extends Model {
  /**
   * Initializes the ProductStatus model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof ProductStatus} The initialized ProductStatus model.
   */
  static initModel(sequelize) {
    return ProductStatus.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: { isIn: [productStatuses] },
        },
      },
      {
        sequelize,
        modelName: 'ProductStatus',
        tableName: 'product_statuses',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for ProductStatus.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    ProductStatus.hasMany(models.Product, { foreignKey: 'status_id' });
  }
}

export default ProductStatus;