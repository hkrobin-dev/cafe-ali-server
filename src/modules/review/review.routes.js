import { Router } from 'express';
import * as reviewController from './review.controller.js';
import { verifyJWT } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { validateObjectId } from '../../middleware/objectId.middleware.js';
import { createReviewSchema, updateReviewSchema } from './review.validation.js';

const router = Router();

// Legacy path preserved
router.get('/reviews', reviewController.listAllReviews);
router.get('/reviews/item/:itemId', validateObjectId('itemId'), reviewController.listReviewsByItem);

router.post('/reviews', verifyJWT, validate(createReviewSchema), reviewController.createReview);
router.patch(
  '/reviews/:id',
  verifyJWT,
  validateObjectId('id'),
  validate(updateReviewSchema),
  reviewController.updateReview
);
router.delete('/reviews/:id', verifyJWT, validateObjectId('id'), reviewController.deleteReview);

export default router;
