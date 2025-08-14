import User from "../db/models/User.js";

export const getUsers = async () => {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'isAdmin'] },
    });
    return users;
}