import { getUsers } from '../services/usersServices.js';

export const getUsersController = async (req, res, next) => {
  const users = await getUsers();
  res.json({
    status: 200,
    message: 'Users retrieved successfully',
    data: users,
  });
};
