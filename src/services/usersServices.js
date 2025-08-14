import bcrypt from 'bcrypt';
import User from '../db/models/User.js';
import createHttpError from 'http-errors';

export const getUsers = async () => {
  const users = await User.findAll({
    attributes: { exclude: ['password', 'isAdmin'] },
  });
  return users;
};

export const register = async userData => {
  const { firstName, lastName, email, password, phoneNumber } = userData;

 if (!firstName || !lastName || !email || !password || !phoneNumber) {
    throw createHttpError(400, 'All fields are required');
 }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw createHttpError(409, 'Email already in use');
  }

  const hashedPassword = password && (await bcrypt.hash(password, 11));
  const avatarUrl = '';

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    avatarUrl,
  });
    
  return {
    id: newUser.id,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    phoneNumber: newUser.phoneNumber,
    avatarUrl: newUser.avatarUrl,
  };
};
