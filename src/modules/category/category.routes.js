import { Router } from 'express';
import * as categoryController from './category.controller.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';
import { validateObjectId } from '../../middleware/objectId.middleware.js';

const router = Router();

router.get('/categories', categoryController.listCategories);
router.post('/categories', verifyJWT, verifyAdmin, categoryController.createCategory);
router.patch('/categories/:id', verifyJWT, verifyAdmin, validateObjectId('id'), categoryController.updateCategory);
router.delete('/categories/:id', verifyJWT, verifyAdmin, validateObjectId('id'), categoryController.deleteCategory);

export default router;
