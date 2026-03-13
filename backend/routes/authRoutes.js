import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, me, registerAdmin } from '../controllers/authController.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/register', [body('email').isEmail(), body('password').isLength({ min: 6 })], registerAdmin);
router.post('/login', login);
router.get('/me', authRequired, me);
router.post('/logout', authRequired, logout);

export default router;
