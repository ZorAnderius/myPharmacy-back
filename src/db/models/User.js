import { Model, DataTypes } from 'sequelize';
import { emailRegexp } from '../../constants/inputVars.js';

class User extends Model {
  static initModel(sequelize) {
    return User.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true, is: emailRegexp } },
        password: { type: DataTypes.STRING, allowNull: false },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        address_id: { type: DataTypes.UUID, allowNull: true },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        underscored: true,
      }
    );
  }

  static associate(models) {
    User.belongsTo(models.Address, { foreignKey: 'address_id' });
    User.hasMany(models.Order, { foreignKey: 'user_id' });
    User.hasOne(models.Cart, { foreignKey: 'user_id' });
    User.hasMany(models.Review, { foreignKey: 'user_id' });
    User.hasMany(models.Wishlist, { foreignKey: 'user_id' });
  }
}

export default User;
