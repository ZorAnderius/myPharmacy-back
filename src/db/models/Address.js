import { Model, DataTypes } from 'sequelize';

/**
 * Represents a physical address in the system.
 * Used for storing location details of Users and Suppliers.
 * An address can be associated with multiple users and suppliers.
 */
class Address extends Model {
  /**
   * Initializes the Address model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Address} The initialized Address model.
   */
  static initModel(sequelize) {
    return Address.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        street: { type: DataTypes.STRING, allowNull: false },
        apartment: { type: DataTypes.STRING, allowNull: true },
        zip_code_id: { type: DataTypes.UUID, allowNull: false },
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

  /**
   * Defines model associations for Address.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Address.hasMany(models.User, { foreignKey: 'address_id', onDelete: 'SET NULL' });
    Address.hasMany(models.Supplier, { foreignKey: 'address_id', as: 'shops', onDelete: 'CASCADE' });
    Address.belongsTo(models.ZipCode, { foreignKey: 'zip_code_id', as: 'zipCode', onDelete: 'CASCADE' });
  }
}

export default Address;
