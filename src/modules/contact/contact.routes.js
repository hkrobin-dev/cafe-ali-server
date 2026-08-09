import { Router } from 'express';
import * as contactController from './contact.controller.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { validateObjectId } from '../../middleware/objectId.middleware.js';
import { createContactSchema, updateContactSchema } from './contact.validation.js';

const router = Router();

router.post('/contact', validate(createContactSchema), contactController.createContact);
router.get('/contact', verifyJWT, verifyAdmin, contactController.listContacts);
router.patch(
  '/contact/:id',
  verifyJWT,
  verifyAdmin,
  validateObjectId('id'),
  validate(updateContactSchema),
  contactController.updateContact
);
router.delete('/contact/:id', verifyJWT, verifyAdmin, validateObjectId('id'), contactController.deleteContact);

export default router;
