import { Model, DataTypes } from 'sequelize';
import { emailRegexp } from '../../constants/inputVars.js';

/**
 * Represents an application user.
 * Stores personal information, authentication data, and related orders, cart, reviews, and wishlist items.
 */
class User extends Model {
  /**
   * Initializes the User model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof User} The initialized User model.
   */
  static initModel(sequelize) {
    return User.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true, is: emailRegexp } },
        password: { type: DataTypes.STRING, allowNull: false },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        avatarUrl: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
        address_id: { type: DataTypes.UUID, allowNull: true },
        isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
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

  /**
   * Defines model associations for User.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    User.belongsTo(models.Address, { foreignKey: 'address_id' });
    User.hasMany(models.Order, { foreignKey: 'user_id' });
    User.hasOne(models.Cart, { foreignKey: 'user_id' });
    User.hasMany(models.Review, { foreignKey: 'user_id' });
    User.hasMany(models.Wishlist, { foreignKey: 'user_id' });
  }
}

export default User;
