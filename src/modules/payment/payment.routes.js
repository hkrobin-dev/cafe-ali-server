import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import { verifyJWT } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createPaymentIntentSchema, createPaymentSchema } from './payment.validation.js';

const router = Router();

// Legacy paths preserved
router.post(
  '/create-payment-intent',
  verifyJWT,
  validate(createPaymentIntentSchema),
  paymentController.createPaymentIntent
);
router.post('/payments', verifyJWT, validate(createPaymentSchema), paymentController.createPayment);
router.get('/payments/:email', verifyJWT, paymentController.getPaymentsByEmail);

export default router;
