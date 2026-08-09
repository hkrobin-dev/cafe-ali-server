import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { verifyJWT } from '../../middleware/auth.middleware.js';
import { validateObjectId } from '../../middleware/objectId.middleware.js';

const router = Router();

// Legacy paths preserved: /carts, /carts/:id
router.get('/carts', verifyJWT, cartController.getCarts);
router.post('/carts', verifyJWT, cartController.addToCart);
router.delete('/carts/:id', verifyJWT, validateObjectId('id'), cartController.deleteCartItem);

export default router;
