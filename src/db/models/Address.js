import { Model, DataTypes } from 'sequelize';

class Address extends Model {
  static initModel(sequelize) {
    return Address.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        street: { type: DataTypes.STRING, allowNull: false },
        city: { type: DataTypes.STRING, allowNull: false },
        apartment: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize,
        modelName: 'Address',
        tableName: 'addresses',
        timestamps: false,
        underscored: true,
      }
    );
  }

  static associate(models) {
    Address.hasMany(models.User, { foreignKey: 'address_id', onDelete: 'SET NULL' });
    Address.hasMany(models.Supplier, { foreignKey: 'address_id', onDelete: 'CASCADE' });
  }
}

export default Address;