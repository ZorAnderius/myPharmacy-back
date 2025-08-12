import { Model, DataTypes } from 'sequelize';

class OrderItem extends Model {
  static initModel(sequelize) {
    return OrderItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        order_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        product_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        timestamps: false,
        underscored: true,
      }
    );
  }
  static associate(models) {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

export default OrderItem;
