import { Model, DataTypes } from 'sequelize';
import { productStatuses } from '../../constants/inputVars.js';

class ProductStatus extends Model {
  static initModel(sequelize) {
    return ProductStatus.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          values: productStatuses,
          validate: {
            isIn: [productStatuses],
          },
        },
      },
      {
        sequelize,
        modelName: 'ProductStatus',
        tableName: 'product_statuses',
      }
    );
  }

  static associate(models) {
    ProductStatus.hasMany(models.Product, { foreignKey: 'status_id' });
  }
}

export default ProductStatus;
