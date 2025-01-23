import { Router, json } from 'express';
import { query } from 'express-validator';
import {
  authAuthorize,
} from '../controllers/index.js';

const router = Router();
router.use(json());


router.use('/authorize', authAuthorize);

router.use('/login', (req, res) => res.redirect('authorize'));

router.use('/logout', (req, res) => null);

router.use('/refresh', (req, res) => {
  console.log('refreshing');
  return res.send({ route: 'refresh auth token' });
});

router.use('/verify', (req, res) => {
  console.log('\nredirected from authorize....');
  console.log('body: ', req.body);
  console.log('query params: ', req.query);
  return res.send({ route: 'grant auth request' });
});


export default router;
