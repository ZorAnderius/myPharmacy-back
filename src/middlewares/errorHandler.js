const errorHandler = (err, req, res, next) => {
    const { status = 500, message = 'Server error' } = err;
    res.status(status).json({ message, data: err.name });
};
