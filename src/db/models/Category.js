import { Model, DataTypes } from 'sequelize';

class Category extends Model {
  static initModel(sequelize) {
    return Category.init({
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
    });
  }
}

export default Category;
