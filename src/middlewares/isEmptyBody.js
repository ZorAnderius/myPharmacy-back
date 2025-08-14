import createHttpError from 'http-errors';

const isEmptyBody = (req, _, next) => {
  if (!Object.keys(req.body).length) {
    return next(createHttpError(400, 'Body must have at least one field'));
  }
  next();
};

export default isEmptyBody;
