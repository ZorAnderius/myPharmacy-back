import { Model, DataTypes } from 'sequelize';
import { emailRegexp } from '../../constants/inputVars.js';

class Supplier extends Model {
  static initModel(sequelize) {
    return (
      Supplier.init({
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        company: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        phone: {
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
        address_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      }),
      {
        sequelize,
        modelName: 'Supplier',
        tableName: 'suppliers',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate(models) {
    Supplier.belongsTo(models.Address, { foreignKey: 'address_id' });
  }
}

export default Supplier;
