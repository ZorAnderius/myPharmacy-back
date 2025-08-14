import DB from "../db/models/index.js"

export const getUsers = async () => {
    const users = await DB.User.findAll({
        attributes: {exclude: ['password', 'createdAt', 'updatedAt']}
    });
    return users;
}