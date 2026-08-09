import { Router } from 'express';
import * as adminController from './admin.controller.js';
import { verifyJWT, verifyAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Legacy path preserved
router.get('/admin-stats', verifyJWT, verifyAdmin, adminController.getAdminStats);

export default router;
