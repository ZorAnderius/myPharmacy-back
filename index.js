import setupServer from './src/server.js';

const bootstrap = () => {
    try {
        setupServer();
    } catch (error) {
        
    }
}

bootstrap();