//all API routes
import app from './serverConfig/initApp.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import usersRouter from './routes/usersRouter.js';
import shopsRouter from './routes/shopsRouter.js';
import storesRouter from './routes/storesRouter.js';
import cartsRouter from './routes/cartsRouter.js';
import ordersRouter from './routes/ordersRouter.js';
import othersRouter from './routes/othersRouter.js';
import { swaggerUi, specs } from './config/swagger.js';

app.use('/api/users', usersRouter);

//route for franchise
app.use('/api/shops', shopsRouter);

//route for client
app.use('/api/stores', storesRouter);

//route for carts
app.use('/api/carts', cartsRouter);

app.use('/api/orders', ordersRouter);

app.use('/api', othersRouter);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'MyPharmacy API Documentation',
}));

//if route is not correct
app.use(notFoundHandler);

//error handler middleware
app.use(errorHandler);

export default app;
