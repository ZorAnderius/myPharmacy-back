//all API routes
import app from './expressConfig/initApp.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

//if route is not correct 
app.use('*', notFoundHandler);

//error handler middleware 
app.use(errorHandler);

export default app;
