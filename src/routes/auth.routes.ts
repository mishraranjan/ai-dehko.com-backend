import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', AuthController.login.bind(AuthController));
router.post('/register', AuthController.register.bind(AuthController));
router.get('/me', authMiddleware, AuthController.me.bind(AuthController));

export default router;
