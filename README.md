# Cafe-Ali Server

Production-ready, modular **Node.js + Express + MongoDB** backend powering the
Cafe-Ali restaurant ordering platform. Built with a clean MVC-style modular
architecture, JWT + Google OAuth authentication, role-based access control,
and Stripe payment integration.

🔗 **Live API:** `https://cafe-ali-server.vercel.app`
🔗 **Frontend Repo:** [cafe-ali-client](#)

---

## ✨ Features

- 🔐 **Authentication** — Email/password (bcrypt) + Google OAuth (server-side ID token verification)
- 🛡️ **Authorization** — JWT-based, role-based access control (`user` / `admin`)
- 🍽️ **Menu Management** — Full CRUD with search, category & price filtering, sorting, and pagination
- 🛒 **Cart & Orders** — Ownership-secured cart, server-verified pricing (never trusts client-sent totals)
- 💳 **Payments** — Stripe integration with payment intent creation and transaction history
- ⭐ **Reviews & Ratings** — Ownership checks, duplicate-review prevention, automatic average-rating recalculation
- 📊 **Admin Analytics** — Real MongoDB aggregation pipelines for dashboards (revenue, user growth, order stats)
- 📁 **Categories & Contact** — Admin-managed categories, public contact form with admin inbox
- 🧰 **Production Hardening** — Centralized error handling, Zod validation, Helmet, rate limiting, CORS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (`jsonwebtoken`) + Google OAuth (`google-auth-library`) |
| Validation | Zod |
| Passwords | bcrypt |
| Payments | Stripe |
| Security | Helmet, express-rate-limit, CORS |
| Deployment | Vercel (serverless) |

---

## 📁 Project Structure

```
server/
├── api/
│   └── index.js              # Vercel serverless entry point
├── src/
│   ├── app.js                 # Express app, all routes wired here
│   ├── server.js               # Local dev entry point (DB connect + listen)
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   └── env.js               # Centralized environment config
│   ├── modules/
│   │   ├── auth/                 # Register, login, Google auth
│   │   ├── user/                 # Profile, admin user management
│   │   ├── item/                 # Menu items (search/filter/sort/pagination)
│   │   ├── category/             # Category CRUD
│   │   ├── review/               # Reviews & ratings
│   │   ├── cart/                 # Shopping cart
│   │   ├── payment/               # Stripe payments
│   │   ├── order/                 # Order analytics
│   │   ├── admin/                 # Admin dashboard stats
│   │   └── contact/               # Contact form
│   ├── middleware/
│   │   ├── auth.middleware.js       # verifyJWT, verifyAdmin, verifyRoles
│   │   ├── error.middleware.js      # Centralized error handler
│   │   ├── validate.middleware.js   # Zod request validation
│   │   ├── objectId.middleware.js   # MongoDB ObjectId validation
│   │   └── rateLimiter.js
│   ├── utils/                    # ApiError, ApiResponse, asyncHandler, JWT helpers
│   └── constants/                # Roles, HTTP status codes
├── vercel.json
├── package.json
└── .env.example
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster
- A Google Cloud OAuth Client ID
- A Stripe account (test mode is fine for development)

### Installation

```bash
git clone https://github.com/<your-username>/cafe-ali-server.git
cd cafe-ali-server
npm install
cp .env.example .env   # then fill in your real values
npm run dev
```

The server runs at `http://localhost:5000` by default. Visit `/health` to confirm it's running.

### Environment Variables

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/cafeAli?retryWrites=true&w=majority

JWT_ACCESS_SECRET=your_super_secret_key
JWT_ACCESS_EXPIRES_IN=1d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

BCRYPT_SALT_ROUNDS=10
```

---

## 📡 API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register with email/password | Public |
| POST | `/api/auth/login` | Login with email/password | Public |
| POST | `/api/auth/google` | Login with Google ID token | Public |
| GET | `/users/me` | Get current user profile | User |
| PATCH | `/users/me` | Update profile | User |
| GET | `/users` | List users (search/filter/pagination) | Admin |
| GET | `/menu` | List menu items (search/filter/sort/pagination) | Public |
| GET | `/menu/:id` | Get item details | Public |
| POST | `/menu` | Create menu item | Admin |
| PATCH | `/menu/:id` | Update menu item | Admin |
| DELETE | `/menu/:id` | Delete menu item | Admin |
| GET / POST / PATCH / DELETE | `/api/categories` | Category management | Public read / Admin write |
| GET / POST / PATCH / DELETE | `/reviews` | Reviews & ratings | Public read / User write |
| GET / POST / DELETE | `/carts` | Shopping cart | User |
| POST | `/create-payment-intent` | Create Stripe payment intent | User |
| POST | `/payments` | Record a completed payment | User |
| GET | `/payments/:email` | Payment history | User (own) / Admin |
| GET | `/admin-stats` | Dashboard overview stats | Admin |
| GET | `/order-stats` | Sales & order aggregation | Admin |
| POST | `/contact` | Submit contact form | Public |
| GET / PATCH / DELETE | `/contact` | Manage contact messages | Admin |

All responses follow a consistent shape:
```json
{ "success": true, "message": "...", "data": { } }
```

---

## 🔒 Security

- Passwords hashed with bcrypt, never returned in API responses
- JWT-protected routes with role-based access control
- Ownership checks prevent users from accessing other users' carts, payments, or reviews
- Payment totals always recalculated server-side — client-sent prices are never trusted
- All `:id` params validated as proper MongoDB ObjectIds before hitting the database
- Centralized error handling with consistent JSON responses and proper HTTP status codes
- Helmet + rate limiting enabled by default

---

## 🌐 Deployment

Deployed on **Vercel** as a serverless function. The `api/index.js` file wraps
the Express app for Vercel's Node.js runtime, while `src/server.js` remains
the entry point for local development.

Live: `https://cafe-ali-server.vercel.app`

---

## 📄 License

This project is built for educational purposes as part of a full-stack
development coursework assignment.
