import { Model, DataTypes } from 'sequelize';
import { orderStatuses } from '../../constants/inputVars.js';

class OrderStatus extends Model {
  static initModel(sequelize) {
    return OrderStatus.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          values: orderStatuses,
          validate: {
            isIn: [orderStatuses],
          },
        },
      },
      {
        sequelize,
        modelName: 'OrderStatus',
        tableName: 'order_statuses',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate(models) {
    OrderStatus.hasMany(models.Order, { foreignKey: 'status_id' });
  }
}

export default OrderStatus;
