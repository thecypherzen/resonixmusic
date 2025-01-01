const globalErrorHandler = (error, response) => {
  if (error.status === 400) {
    return response.status(400).send({ error: 'Bad request' });
  }
  if (error.status === 500) {
    return response
      .status(500)
      .send({ error: 'Internal server error' });
  }
  return response
    .status(error.response.status)
    .send({ error: `${error.response.statusText || ''}` });
};

export default globalErrorHandler;
