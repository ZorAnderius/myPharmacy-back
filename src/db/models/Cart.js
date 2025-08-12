import { Model, DataTypes } from 'sequelize';

class Cart extends Model {
  static initModel(sequelize) {
    return Cart.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
        timestamps: false,
        underscored: true,
      }
    );
  }
  static associate(models) {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', onDelete: 'CASCADE' });
  }
}

export default Cart;
