import { ValidationError } from 'sequelize';

const controllerWrapper = ctrl => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) {
        error.status = 400;
        if (error.name === 'SequelizeValidationError') {
          error.status = 409;
          error.message = 'Validation error occurred';
        }
      }
      next();
    }
  };
};

export default controllerWrapper;
