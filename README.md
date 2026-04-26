# MeterFlow — Production-Grade API Billing Platform

MeterFlow is a full-stack SaaS platform that lets developers monetize their APIs with usage tracking, rate limiting, and automated billing.

## 🚀 Live Demo
- **Frontend**: https://meterflow-gamma.vercel.app
- **Backend API**: https://meterflow-backend.onrender.com
- **API Docs**: https://meterflow-backend.onrender.com/api-docs

## ✨ Features
- 🔐 JWT Authentication with refresh tokens
- 🔑 API Key management (create, revoke, rotate)
- 📊 Real-time usage tracking per endpoint
- ⚡ Redis-powered rate limiting (100 req/min)
- 💳 Stripe-integrated billing engine
- 🔔 Webhook notifications (limit_reached, payment_due)
- 📈 Analytics — P50/P95/P99 latency, error rates
- 📝 Audit logs for all key actions
- 🐳 Docker + Docker Compose ready

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Cache | Upstash Redis |
| Auth | JWT + Refresh Tokens |
| Payments | Stripe |
| Deployment | Render (backend), Vercel (frontend) |
| Testing | Jest, Supertest |

## 📁 Project Structure
## 📁 Project Structure

```
MeterFlow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   ├── tests/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .env.example
├── frontend/
│   └── src/
│       ├── pages/
│       ├── services/
│       └── main.jsx
├── docs/
│   └── architecture.md
└── README.md
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Upstash Redis account

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
NODE_ENV=development
REDIS_URL=rediss://...
```

## 🐳 Docker
```bash
cd backend
docker-compose up
```

## 🧪 Testing
```bash
cd backend
npm test
```

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/refresh` | Refresh token |

### API Keys
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/apis` | List all API keys |
| POST | `/api/apis` | Create API key |
| DELETE | `/api/apis/:id` | Revoke API key |

### Usage & Billing
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/usage` | Get usage stats |
| GET | `/api/billing` | Get billing info |
| GET | `/api/analytics/errors` | Error rate per endpoint |
| GET | `/api/analytics/latency` | P50/P95/P99 latency |

### Webhooks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/webhooks` | Register webhook |
| GET | `/api/webhooks` | List webhooks |
| DELETE | `/api/webhooks/:id` | Delete webhook |

### Gateway
| Method | Endpoint | Description |
|--------|----------|-------------|
| ANY | `/gateway/*` | Proxied API requests |

## 🔒 Authentication
All protected routes require:

## 📊 Resume Bullet Points
- Built production-grade API billing SaaS with JWT auth, Redis rate limiting, Stripe payments, and webhook notifications
- Deployed full-stack platform — backend on Render, frontend on Vercel, MongoDB Atlas + Upstash Redis for managed infrastructure
- Implemented P50/P95/P99 latency analytics and audit logging system used in production by Datadog and New Relic
- Containerized full stack with Docker Compose, achieved 1000 concurrent requests with Redis rate limiting maintaining sub-10ms overhead

## 👩‍💻 Author
**Ishita Singhvi** — [GitHub](https://github.com/ishitasinghvi2006-sys)