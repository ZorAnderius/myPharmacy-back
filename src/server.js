import app from './app.js';

const PORT = 8000;

const setupServer = () => {
    app.listen(PORT, () => {
        console.log(`Server is running. Use our API on port: ${PORT}`);
    });
};

export default setupServer;
