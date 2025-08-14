import createHttpError from 'http-errors';

const validateBody = schema => {
  return (req, __, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      next(createHttpError(400, error.message));
    }
    next();
  };
};

export default validateBody;