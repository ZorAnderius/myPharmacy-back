import app from './app.js';

const PORT = 8000;

const setupServer = () => {
    app.listen(PORT, () => {
        console.log(`\x1b[35mServer is running on the port ${PORT}\x1b[0m`);
    });
};

export default setupServer;
