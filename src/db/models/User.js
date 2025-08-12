import { Model, DataTypes } from 'sequelize';
import { emailRegexp } from '../../constants/inputVars.js';

class User extends Model {
  static init(sequelize) {
    return User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isEmail: true,
            is: emailRegexp,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        address_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
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
    User.hasMany(models.Order, { foreignKey: 'user_id' });
    User.hasMany(models.Address, { foreignKey: 'user_id' });
  }
}

export default User;