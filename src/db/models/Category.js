import { Model, DataTypes } from 'sequelize';

/**
 * Represents a product category in the catalog.
 * Helps in organizing products into different groups.
 */
class Category extends Model {
  /**
   * Initializes the Category model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Category} The initialized Category model.
   */
  static initModel(sequelize) {
    return Category.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Category.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Category.hasMany(models.Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });
  }
}

export default Category;