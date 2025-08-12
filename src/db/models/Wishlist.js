import { Model, DataTypes } from 'sequelize';

class Wishlist extends Model {
  static initModel(sequelize) {
        return Wishlist.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            product_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Wishlist',
            tableName: 'wishlists',
            timestamps: false,
            underscored: true,
            uniqueKeys: {
                unique_wishlist: {
                    fields: ['user_id', 'product_id'],
                },
            }
        });
    }

    static associate(models) {
        Wishlist.belongsTo(models.User, { foreignKey: 'user_id' });
        Wishlist.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
}

export default Wishlist;
