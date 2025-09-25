import { Model, DataTypes } from 'sequelize';
import { emailRegexp } from '../../constants/inputVars.js';

/**
 * Represents a supplier who provides products.
 * Stores supplier details, contact info, and links to their address and products.
 */
class Supplier extends Model {
  /**
   * Initializes the Supplier model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize - Sequelize connection instance.
   * @returns {typeof Supplier} The initialized Supplier model.
   */
  static initModel(sequelize) {
    return Supplier.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        ownerName: { type: DataTypes.STRING, allowNull: true },
        phone: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true, is: emailRegexp } },
        hasDelivery: { type: DataTypes.BOOLEAN, defaultValue: false },
        address_id: { type: DataTypes.UUID, allowNull: false },
        user_id: { type: DataTypes.UUID, allowNull: false },
      },
      {
        sequelize,
        modelName: 'Supplier',
        tableName: 'suppliers',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines model associations for Supplier.
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    Supplier.belongsTo(models.Address, { as: 'address', foreignKey: 'address_id' });
    Supplier.hasMany(models.Product, { foreignKey: 'supplier_id', onDelete: 'CASCADE' });
    Supplier.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  }
}

export default Supplier;
