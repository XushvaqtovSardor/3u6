export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
    name: err.name,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  };
  if (err.errors) payload.errors = err.errors;
  res.status(status).json(payload);
};

export default errorHandler;
