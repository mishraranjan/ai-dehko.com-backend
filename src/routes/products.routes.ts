import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.get('/', ProductController.getAll.bind(ProductController));
router.get('/trending', ProductController.trending.bind(ProductController));
router.get('/:id', ProductController.getById.bind(ProductController));
router.post('/compare', ProductController.compare.bind(ProductController));
router.post('/', authMiddleware, ProductController.create.bind(ProductController));
router.put('/:id', authMiddleware, ProductController.update.bind(ProductController));
router.delete('/:id', authMiddleware, ProductController.delete.bind(ProductController));
export default router;