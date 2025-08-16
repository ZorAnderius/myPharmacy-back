import { Model, DataTypes } from 'sequelize';

class RefreshToken extends Model {
  /**
   * Initialize the model
   * @param {import('sequelize').Sequelize} sequelize
   * @return {typeof RefreshToken} The initialized RefreshToken model.
   */
  static initModel(sequelize) {
    RefreshToken.init(
      {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: { type: DataTypes.UUID, allowNull: false },
        jti: { type: DataTypes.STRING, allowNull: false, unique: true },
        token_hash: { type: DataTypes.STRING, allowNull: false },
        revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
        replaced_by: { type: DataTypes.UUID, allowNull: true },
        expires_at: { type: DataTypes.DATE, allowNull: false },
        ip: { type: DataTypes.STRING, allowNull: true },
        user_agent: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize,
        modelName: 'RefreshToken',
        tableName: 'refresh_tokens',
        timestamps: true,
        underscored: true,
      }
    );
  }

  /**
   * Define associations
   *
   * @param {Object} models - All Sequelize models.
   */
  static associate(models) {
    RefreshToken.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  }
}

export default RefreshToken;
