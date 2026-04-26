# MeterFlow Architecture

## System Overview
MeterFlow is a multi-tenant API billing platform built with a decoupled frontend/backend architecture.

## Architecture Diagram
┌─────────────────┐         ┌──────────────────────┐
│   React Frontend │ ──────▶ │   Express.js Backend  │
│   (Vercel)       │  HTTPS  │   (Render.com)        │
└─────────────────┘         └──────────┬───────────┘
│
┌───────────────────┼────────────────────┐
▼                   ▼                    ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────────┐
│ MongoDB Atlas │   │ Upstash Redis│   │  Stripe API      │
│  (Database)   │   │   (Cache)    │   │  (Payments)      │
└──────────────┘   └──────────────┘   └──────────────────┘
## Components

### Frontend (React + Vite)
- **Login/Register** — JWT authentication
- **Dashboard** — Real-time usage charts
- **APIs** — API key management
- **Usage** — Request analytics
- **Billing** — Invoice and payment history

### Backend (Node.js + Express)
- **Auth Routes** — Register, login, refresh token
- **API Routes** — CRUD for API keys
- **Gateway** — Proxy with rate limiting
- **Usage Routes** — Track and query usage
- **Billing Routes** — Calculate and retrieve bills
- **Webhook Routes** — Register and trigger webhooks
- **Analytics Routes** — Error rates, latency percentiles

### Database (MongoDB Atlas)
| Collection | Purpose |
|------------|---------|
| users | User accounts |
| apikeys | API key management |
| usagelogs | Request tracking |
| billings | Invoice records |
| payments | Payment history |
| webhooks | Webhook registrations |
| auditlogs | Action audit trail |
| refreshtokens | JWT refresh tokens |

### Cache (Upstash Redis)
- Rate limiting counters (100 req/min per API key)
- Session caching
- Request count windows

## Request Flow
Client Request
│
▼
Gateway Middleware
│
├── Validate API Key (MongoDB lookup)
│
├── Check Rate Limit (Redis counter)
│         │
│         └── If exceeded → Trigger Webhook → 429 Response
│
├── Log Usage (MongoDB write)
│
└── Forward to API → Response
## Security
- JWT access tokens (7d expiry)
- Refresh token rotation
- bcrypt password hashing
- Helmet.js security headers
- CORS protection
- Rate limiting per API key

## Deployment
| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | meterflow-gamma.vercel.app |
| Backend | Render | meterflow-backend.onrender.com |
| Database | MongoDB Atlas | Cloud hosted |
| Cache | Upstash Redis | Serverless Redis |