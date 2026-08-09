import { Router } from 'express';
import * as itemController from './item.controller.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { validateObjectId } from '../../middleware/objectId.middleware.js';
import { createItemSchema, updateItemSchema } from './item.validation.js';

const router = Router();

// Legacy path /menu preserved as primary listing/detail API
router.get('/menu', itemController.listItems);
router.get('/menu/:id', validateObjectId('id'), itemController.getItemById);
router.get('/menu/:id/related', validateObjectId('id'), itemController.getRelatedItems);

router.post('/menu', verifyJWT, verifyAdmin, validate(createItemSchema), itemController.createItem);
router.patch(
  '/menu/:id',
  verifyJWT,
  verifyAdmin,
  validateObjectId('id'),
  validate(updateItemSchema),
  itemController.updateItem
);
router.delete('/menu/:id', verifyJWT, verifyAdmin, validateObjectId('id'), itemController.deleteItem);

export default router;
