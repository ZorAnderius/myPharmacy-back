//all API routes
import app from './serverConfig/initApp.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import usersRouter from './routes/usersRouter.js';

app.use('/api/users', usersRouter);

//if route is not correct
app.use(notFoundHandler);

//error handler middleware
app.use(errorHandler);

export default app;
