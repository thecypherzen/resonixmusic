const globalErrorHandler = (error, response) => {
  if (error.status === 400) {
    return response.status(400).send({ error: 'Bad request' });
  }
  if (error.status === 500) {
    return response
      .status(500)
      .send({ error: 'Internal server error' });
  }
  const requestErr = error ?.response?.status ?? null;
  return requestErr
    ? response.status(error.response.status)
              .send({ error: `${error.response.statusText || ''}` })
    : response.status(500)
              .send({ error: error?.code ?? 'some error',
                       details: {
                         message: error?.message ?? error.code,
                         stack: error?.stack ?? null
                       }});

};

export default globalErrorHandler;
