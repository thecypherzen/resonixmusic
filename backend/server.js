// Backend server

import express from 'express';


const app = express();

app.listen(process.env.RXSERVER || 5000, () => {
  console.log('resonix server listening on port',
     process.env.RXSERVER || 5000);
});
