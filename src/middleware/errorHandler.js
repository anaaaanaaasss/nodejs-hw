import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {

  const isHttp =
    typeof createHttpError.isHttpError === 'function'
      ? createHttpError.isHttpError(err)
      : err instanceof createHttpError.HttpError;

  const status = isHttp ? (err.status || err.statusCode || 500) : 500;
  const message = isHttp ? err.message : 'Internal Server Error';

  if (!isHttp) req?.log?.error?.(err);

  res.status(status).json({ message });
};
