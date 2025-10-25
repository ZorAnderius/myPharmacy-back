import setupServer from './src/server.js';

/**
 * Initializes and sets up the server.
 * Calls the `setupServer` function and handles any errors during initialization.
 * If an error occurs, it logs the error and terminates the process with exit code 1.
 *
 * @throws {Error} - Any error thrown by `setupServer` will be logged and cause process termination.
 *
 * @usage
 * bootstrap(); // Starts the server, exits process if setup fails
 */
const bootstrap = () => {
    try {
        setupServer();
    } catch (error) {
        process.exit(1); // if server broken down when its run first time
    }
}

bootstrap();