import { Router } from 'express';
import * as orderController from './order.controller.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Legacy path preserved
router.get('/order-stats', verifyJWT, verifyAdmin, orderController.getOrderStats);

export default router;
