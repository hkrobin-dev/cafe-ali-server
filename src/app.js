import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

import authRoutes, { legacyJwtRouter } from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import itemRoutes from './modules/item/item.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import reviewRoutes from './modules/review/review.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';

const app = express();

// --- Security & core middleware ---
app.use(helmet());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://cafe-ali-client.vercel.app",
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

// --- Health check ---
app.get('/', (_req, res) => {
  res.status(200).json({ success: true, message: 'Cafe Ali backend is running' });
});
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, uptime: process.uptime() });
});

// --- Legacy top-level routes (preserved exactly for existing frontend contracts) ---
app.use('/', legacyJwtRouter); // /jwt
app.use('/', userRoutes); // /users, /user/admin/:email
app.use('/', itemRoutes); // /menu, /menu/:id
app.use('/', reviewRoutes); // /reviews
app.use('/', cartRoutes); // /carts, /carts/:id
app.use('/', paymentRoutes); // /create-payment-intent, /payments, /payments/:email
app.use('/', orderRoutes); // /order-stats
app.use('/', adminRoutes); // /admin-stats
app.use('/', contactRoutes); // /contact

// --- New, namespaced APIs added in Update-1 ---
app.use('/api/auth', authRoutes); // /api/auth/register, /login, /google
app.use('/api', categoryRoutes); // /api/categories

// --- 404 + centralized error handling (must be last) ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
