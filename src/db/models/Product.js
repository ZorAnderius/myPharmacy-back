import { Model, DataTypes } from 'sequelize';

class Product extends Model {
  static initModel(sequelize) {
    return (
      Product.init({
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        discount: {
          type: DataTypes.DECIMAL(5, 2),
          allowNull: true,
          defaultValue: 0.0,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isUrl: true,
          },
        },
        supplier_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        category_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        status_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      }),
      {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate(models) {
    Product.belongsTo(models.Supplier, { foreignKey: 'supplier_id' });
    Product.belongsTo(models.Category, { foreignKey: 'category_id' });
    Product.belongsTo(models.ProductStatus, { foreignKey: 'status_id' });
  }
}

export default Product;
