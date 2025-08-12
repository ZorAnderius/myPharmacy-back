import { Model, DataTypes } from 'sequelize';

class Category extends Model {
  static initModel(sequelize) {
    return Category.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        timestamps: false,
        underscored: true,
      }
    );
    }
    
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: 'category_id', onDelete: 'CASCADE' });
    }
}

export default Category;
