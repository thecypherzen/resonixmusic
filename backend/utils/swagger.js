import swaggerJsdoc from  'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import version from '../package.json' assert { type: 'json' };
import { RXBE_PORT } from '../defaults/index.js';

const options = {
  definition: {
    openapi: '3.1.0',
    details: {
      title: 'ResonixMusic Public API Documentation',
      version: '1.0.0',
      description: 'Ineteract with ResonixMusic through our robust and public api',
    },
  },
  servers: [
    `http://127.0.0.1:${RXBE_PORT}`,
  ],
  apis: [
    '../routes/*.js',
  ],
}

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = function (app) {
  //Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Swagger UI JSON
  app.use('/docs.json', (req, res) => {
    res.set('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  console.log(`API Docs available at http://0.0.0.0:${RXBE_PORT}/docs`);
}

export default swaggerDocs;
