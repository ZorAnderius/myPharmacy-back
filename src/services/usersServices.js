import bcrypt from 'bcrypt';
import User from '../db/models/User.js';
import createHttpError from 'http-errors';

/**
 * Finds a single user by the given query.
 * @param {Object} query - Query object for filtering the user (e.g., { email: string }).
 * @returns {Promise<Object|null>} - Returns the user object if found, otherwise null.
 */
export const getUser = async query => {
  const user = await User.findOne({ where: query });
  return user;
};

/**
 * Registers a new user.
 * Validates required fields, checks if the email is already in use,
 * hashes the password, and creates a new user record.
 * 
 * @param {Object} userData - Object containing user data.
 * @param {string} userData.firstName - First name of the user.
 * @param {string} userData.lastName - Last name of the user.
 * @param {string} userData.email - Email of the user.
 * @param {string} userData.password - Plain text password.
 * @param {string} userData.phoneNumber - User's phone number.
 * @returns {Promise<Object>} - Returns the newly created user object (without password).
 * @throws {HttpError} - Throws 400 if any required field is missing.
 * @throws {HttpError} - Throws 409 if email is already in use.
 */
export const register = async userData => {
  const { firstName, lastName, email, password, phoneNumber } = userData;
  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    throw createHttpError(400, 'All fields are required');
  }
  const existingUser = await getUser({ email });
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

/**
 * Authenticates a user with email and password.
 * Validates input, checks if user exists, and compares password hashes.
 * 
 * @param {Object} credentials - Object containing login credentials.
 * @param {string} credentials.email - User's email.
 * @param {string} credentials.password - Plain text password.
 * @returns {Promise<Object>} - Returns the authenticated user object (without password).
 * @throws {HttpError} - Throws 400 if email or password is missing.
 * @throws {HttpError} - Throws 401 if email or password is invalid.
 */
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createHttpError(400, 'Email and password are required');
  }
  const user = await getUser({ email });
  if (!user) throw createHttpError(401, 'Invalid email or password');
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl,
  };
};
