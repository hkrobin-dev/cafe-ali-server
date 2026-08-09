import { Router } from 'express';
import * as userController from './user.controller.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { validateObjectId } from '../../middleware/objectId.middleware.js';
import { updateMeSchema, updateRoleSchema } from './user.validation.js';

const router = Router();

router.get('/users/me', verifyJWT, userController.getMe);
router.patch('/users/me', verifyJWT, validate(updateMeSchema), userController.updateMe);

// Legacy: kept because frontend depends on it
router.get('/user/admin/:email', verifyJWT, userController.checkIsAdmin);

router.get('/users', verifyJWT, verifyAdmin, userController.listUsers);
router.patch(
  '/users/:id/role',
  verifyJWT,
  verifyAdmin,
  validateObjectId('id'),
  validate(updateRoleSchema),
  userController.updateUserRole
);
router.delete('/users/:id', verifyJWT, verifyAdmin, validateObjectId('id'), userController.deleteUser);

export default router;
