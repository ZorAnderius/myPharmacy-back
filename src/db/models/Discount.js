import { Model, DataTypes } from 'sequelize';

class Discount extends Model {
  static initModel(sequelize) {
    return Discount.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        percentage: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0.0,
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
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

  static associate(models) {
    Discount.belongsTo(models.Product, { foreignKey: 'product_id' });
  }
}

export default Discount;
