import { Model, DataTypes } from 'sequelize';

/**
 * Represents a product in the catalog.
 * Stores details such as name, description, price, quantity, and links to supplier, category, and status.
 */
class Product extends Model {
  /**
   * Initializes the Product model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Product} The initialized Product model.
   */
  static initModel(sequelize) {
    return Product.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        image_url: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
        supplier_id: { type: DataTypes.UUID, allowNull: false },
        category_id: { type: DataTypes.UUID, allowNull: true },
        status_id: { type: DataTypes.UUID, allowNull: false },
      },
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Product.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Product.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.ProductStatus, { foreignKey: 'status_id' });
    Product.hasMany(models.Discount, { foreignKey: 'product_id' });
    Product.hasMany(models.CartItem, { foreignKey: 'product_id' });
    Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
    Product.hasMany(models.Review, { foreignKey: 'product_id' });
    Product.hasMany(models.Wishlist, { foreignKey: 'product_id' });
  }
}

export default Product;
