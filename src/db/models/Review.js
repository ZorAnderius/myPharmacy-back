import { Model, DataTypes } from "sequelize";

class Review extends Model {
  static initModel(sequelize) {
      return Review.init({
        id: {
          type: DataTypes.UUID,
              defaultValue: DataTypes.UUIDV4,
              primaryKey: true,
          },
        content: {
          type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 10,
            },
        },
          product_id: {
              type: DataTypes.UUID,
              allowNull: false,
          },
          user_id: {
              type: DataTypes.UUID,
              allowNull: false,
            },
      }
          , {
        sequelize,
        modelName: 'Review',
              tableName: 'reviews',
        timestamps: false,
        underscored: true,
      });
    }     
    
    static associate(models) {
        Review.belongsTo(models.Product, { foreignKey: 'product_id' });
        Review.belongsTo(models.User, { foreignKey: 'user_id' });
    }
}
export default Review;