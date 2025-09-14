import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes protected by auth
router.use(authMiddleware);

router.get('/', UserController.getAll.bind(UserController));
router.put('/:id', UserController.update.bind(UserController));
router.delete('/:id', UserController.delete.bind(UserController));

export default router;