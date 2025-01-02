export const globalErrorHandler = (err, res) => {
  console.error('Error:', err);
  
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return res.status(err.response.status).json({
      error: 'API Error',
      message: err.response.data.message || 'An error occurred with the external API',
      status: err.response.status
    });
  } else if (err.request) {
    // The request was made but no response was received
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'No response received from the API',
      status: 503
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    return res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
      status: 500
    });
  }
};

export const validateQueryParams = (req, requiredParams = []) => {
  const errors = [];
  for (const param of requiredParams) {
    if (!req.query[param]) {
      errors.push(`Missing required query parameter: ${param}`);
    }
  }
  return errors;
};