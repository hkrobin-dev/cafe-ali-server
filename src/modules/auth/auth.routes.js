import { Router } from 'express';
import * as authController from './auth.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema, googleAuthSchema, jwtSchema } from './auth.validation.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/google', authLimiter, validate(googleAuthSchema), authController.googleAuth);

// Legacy route preserved at root level as /jwt (mounted separately in app.js)
export const legacyJwtRouter = Router();
legacyJwtRouter.post('/jwt', authLimiter, validate(jwtSchema), authController.issueJwt);

export default router;
