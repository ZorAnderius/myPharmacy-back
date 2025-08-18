import { Model, DataTypes } from 'sequelize';

class ZipCode extends Model {
  /**
   * Initializes the ZipCode model in Sequelize.
   *
   * @param {import('sequelize').Sequelize} sequelize
   * @returns {typeof ZipCode}
   */
  static initModel(sequelize) {
    return ZipCode.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        code: { type: DataTypes.STRING, allowNull: false },
        city: { type: DataTypes.STRING, allowNull: true },
        region: { type: DataTypes.STRING, allowNull: true },
        country: { type: DataTypes.STRING, allowNull: true, defaultValue: 'UK' },
      },
      {
        sequelize,
        modelName: 'ZipCode',
        tableName: 'zip_codes',
        timestamps: false,
        underscored: true,
      }
    );
  }

  /**
   * Defines associations for ZipCode.
   *
   * @param {Object} models
   */
  static associate(models) {
    ZipCode.hasMany(models.Address, { foreignKey: 'zip_code_id', onDelete: 'CASCADE' });
  }
}
