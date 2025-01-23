import { Router, json } from 'express';
import { query } from 'express-validator';


const router = Router();
router.use(json());

router.use('/authorize', (req, res) => {
  console.log('new authorization request');
  return res.send({ route: 'new authorization request' });
});

router.use('/verify', (req, res) => {
  console.log('body: ', req.body);
  console.log('params: ', req.params);
  console.log('cookies: ', req.cookies);
  return res.send({ route: 'grant auth request' });
});

router.use('/refresh', (req, res) => {
  console.log('refreshing');
  return res.send({ route: 'refresh auth token' });
});

export default router;
