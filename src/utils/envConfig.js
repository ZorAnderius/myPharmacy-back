import 'dotenv/config';

/**
 * Retrieves an environment variable by name, with optional default value.
 * Throws an error if the environment variable is not set and no default value is provided.
 *
 * @param {string} name - The name of the environment variable to retrieve.
 * @param {string} [defaultValue] - Optional default value to return if the environment variable is not set.
 * @returns {string} - The value of the environment variable or the default value.
 * @throws {Error} - Throws an error if the environment variable is missing and no default value is provided.
 *
 * @example
 * const PORT = env('PORT', '3000'); // returns process.env.PORT or '3000' if not set
 * const SECRET_KEY = env('SECRET_KEY'); // throws Error if process.env.SECRET_KEY is not set
 */
const env = (name, defaultValue) => {
    const value = process.env[name];
    if (value) return value;
    if (defaultValue) return defaultValue;
    throw new Error(`Missing process.env['${name}']`);
};

export default env;
