# Squid Game-7 — Backend (Update-1)

Production-ready, modular Node.js + Express + MongoDB backend. Built to satisfy the Update-1
requirements while **preserving every existing legacy API contract** so the current frontend
keeps working without changes.

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication + Google OAuth (`google-auth-library`)
- bcrypt password hashing
- Zod validation
- Stripe payments
- Helmet + express-rate-limit (security hardening)

## Getting Started

```bash
cd server
npm install
cp .env.example .env   # fill in real values
npm run dev             # nodemon, http://localhost:5000
```

## Folder Structure

```
server/
  src/
    app.js               # express app, all routes wired here
    server.js             # entry point, DB connect + listen
    config/
      db.js                # mongoose connection
      env.js               # centralized env loader
    modules/
      auth/                # register, login, google auth, legacy /jwt
      user/                # profile, admin user management, legacy /user/admin/:email
      item/                # /menu, /menu/:id (search, filter, sort, pagination)
      category/            # /api/categories
      review/              # /reviews (ratings, ownership, duplicate prevention)
      cart/                # /carts, /carts/:id (ownership secured)
      payment/             # /create-payment-intent, /payments, /payments/:email
      order/                # /order-stats (aggregation)
      admin/                # /admin-stats (aggregation)
      contact/              # /contact (public POST, admin manage)
    middleware/
      auth.middleware.js    # verifyJWT, verifyAdmin, verifyRoles, verifyOwnership
      error.middleware.js   # centralized error handler
      validate.middleware.js
      objectId.middleware.js
      rateLimiter.js
    utils/                  # ApiError, ApiResponse, asyncHandler, token helpers
    constants/              # roles, HTTP status codes
```

## Legacy APIs Retained (unchanged paths)

| Endpoint | Notes |
|---|---|
| `POST /jwt` | Legacy token issuance |
| `GET/PATCH /users`, `/users/me` | + pagination, search, role mgmt |
| `GET /user/admin/:email` | Admin check |
| `GET/POST/PATCH/DELETE /menu`, `/menu/:id` | + search/filter/sort/pagination |
| `GET/POST/PATCH/DELETE /reviews` | + ownership + duplicate prevention |
| `GET/POST/DELETE /carts`, `/carts/:id` | + ownership enforced |
| `POST /create-payment-intent` | Server-side price verification |
| `GET /payments/:email`, `POST /payments` | JWT ownership check |
| `GET /admin-stats`, `/order-stats` | Real MongoDB aggregation |
| `POST/GET/PATCH/DELETE /contact` | New module for Update-1 |

## New Namespaced APIs (Update-1)

| Endpoint | Purpose |
|---|---|
| `POST /api/auth/register` | Email/password registration |
| `POST /api/auth/login` | Email/password login |
| `POST /api/auth/google` | Google ID token login |
| `GET/POST/PATCH/DELETE /api/categories` | Category management |

## Security Notes
- Passwords hashed with bcrypt, never returned in responses.
- JWT required on all protected routes; role-based access via `verifyAdmin`/`verifyRoles`.
- Ownership checks prevent users from reading/modifying other users' cart, payments, or reviews.
- Payment totals are always recalculated server-side from the database — client-sent prices are
  never trusted.
- All `:id` route params validated as proper Mongo ObjectIds before hitting the DB.
- Centralized error handler returns consistent JSON with proper HTTP status codes.
- Helmet + rate limiting enabled by default; tighten CORS `CLIENT_URL` for production.

## Next Steps (Frontend Integration)
1. Point your frontend `baseURL` to this server.
2. For JWT-protected calls, send `Authorization: Bearer <token>`.
3. Existing frontend code that calls `/menu`, `/reviews`, `/carts`, `/payments`, `/admin-stats`,
   etc. should work unchanged — only the response is now wrapped as
   `{ success, message, data }`, so update your data destructuring accordingly
   (e.g. `res.data.data` instead of `res.data`).
