import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import version from '../../package.json' assert { type: 'json' };
import { RXBE_PORT } from '../../defaults/index.js';

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'ResonixMusic Public API Documentation',
      version: version.version,
      description: 'Interact with ResonixMusic through our robust and public API',
    },
    servers: [
      {
        url: `http://127.0.0.1:${RXBE_PORT}`,
        description: 'Backend Development server'
      }
    ],
  },
  apis: [
    './utils/swagger/components.yaml',
    './routes/*.js',
    './server.js'
  ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = function (app) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "Resonix API Documentation",
    customfavIcon: "/favicon-logo.svg",
    customCss: `
      .swagger-ui {
        background-color: #000;
        color: #ffffff;
      }
      .swagger-ui .opblock {
        background-color: #000;
        border: 1px solid #333;
        color: #fff;
      }
      .swagger-ui .opblock .opblock-summary-method {
        background-color: #333;
      }
      .swagger-ui .opblock .opblock-summary {
        border-bottom: 1px solid #333;
      }
      .swagger-ui input[type=text], 
      .swagger-ui textarea {
        background-color: #000;
        color: #fff;
        border: 1px solid #333;
      }
      .swagger-ui .topbar {
        display: none;
      }
      .swagger-ui .scheme-container {
        background-color: #000;
      }
      .swagger-ui select {
        background-color: #000;
        color: #fff;
        border: 1px solid #333;
      }
      .swagger-ui select option {
        background-color: #000;
        color: #fff;
      }
      .swagger-ui select::placeholder {
        color: #fff;
      }
      .swagger-ui .btn {
        background-color: #000;
        color: #fff;
        border: 1px solid #333;
      }
      .swagger-ui .model {
        color: #fff;
      }
      .swagger-ui .model-toggle:after {
        background-color: #000;
      }
      .swagger-ui section.models {
        border: 1px solid #333;
      }
      .swagger-ui section.models .model-container {
        background-color: #242424;
      }
      .swagger-ui .responses-table thead tr td, 
      .swagger-ui .responses-table thead tr th, 
      .swagger-ui .parameters-table thead tr td, 
      .swagger-ui .parameters-table thead tr th {
        color: #fff;
      }
      .swagger-ui .response-col_status {
        color: #fff;
      }
      .swagger-ui table tbody tr td {
        color: #fff;
      }
      .swagger-ui .opblock-tag {
        border-bottom: 1px solid #000;
        color: #fff;
      }
      .swagger-ui .markdown p, 
      .swagger-ui .markdown pre, 
      .swagger-ui .renderedMarkdown p, 
      .swagger-ui .renderedMarkdown pre {
        color: #fff;
      }
      .swagger-ui .info .title {
        color: #fff;
      }
      .swagger-ui .info li, 
      .swagger-ui .info p, 
      .swagger-ui .info table {
        color: #fff;
      }
      .swagger-ui input::placeholder,
      .swagger-ui textarea::placeholder {
        color: #fff;
      }
      .swagger-ui select:focus,
      .swagger-ui input:focus,
      .swagger-ui textarea:focus,
      .swagger-ui button:focus {
        outline: none;
      }
    `
  }));

  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`API Docs available at http://0.0.0.0:${RXBE_PORT}/docs`);
};

export default swaggerDocs;