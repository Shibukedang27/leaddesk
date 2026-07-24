# LeadDesk Mini

> Modern Lead Management CRM built with React, FastAPI, MongoDB Atlas, and a premium SaaS dashboard experience.

<p>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-0f172a"></a>
  <img alt="Frontend" src="https://img.shields.io/badge/frontend-React%20%2B%20Vite-2563eb">
  <img alt="Backend" src="https://img.shields.io/badge/backend-FastAPI-059669">
  <img alt="Database" src="https://img.shields.io/badge/database-MongoDB%20Atlas-10b981">
  <img alt="TypeScript" src="https://img.shields.io/badge/types-TypeScript-3178c6">
  <img alt="Tests" src="https://img.shields.io/badge/tests-Pytest%20%2B%20Vitest-f59e0b">
  <img alt="Deploy" src="https://img.shields.io/badge/deploy-Vercel%20%2B%20Render-black">
</p>

LeadDesk Mini is a production-ready CRM MVP for capturing, authenticating, searching, filtering, and managing sales leads. It was built as a full-stack portfolio project with the same care expected in an early-stage SaaS codebase: typed contracts, secure defaults, clean service boundaries, polished UI, deployment-ready configuration, and automated quality checks.

## Screenshots

Add these captures before publishing the repository:

| Landing | Dashboard |
| --- | --- |
| `docs/assets/screenshots/landing-desktop.png` | `docs/assets/screenshots/dashboard-desktop.png` |

| Login | Responsive |
| --- | --- |
| `docs/assets/screenshots/login-desktop.png` | `docs/assets/screenshots/responsive-showcase.png` |

Suggested visual assets are documented in [docs/PORTFOLIO_ASSETS.md](./docs/PORTFOLIO_ASSETS.md).

## Highlights

- Premium public landing page and authenticated admin dashboard.
- JWT admin authentication with bcrypt password verification.
- Async FastAPI backend using Motor and MongoDB Atlas.
- Lead capture, search, filtering, sorting, pagination, and status updates.
- Dynamic dashboard summary with recent leads and latest activity.
- Standard API envelopes for success, error, and paginated responses.
- Secure middleware: CORS, trusted hosts, headers, compression, request logging, rate limiting, and timeouts.
- Production deployment setup for Vercel, Render, and MongoDB Atlas.
- Automated backend and frontend tests with coverage reports.
- Open-source ready GitHub templates, security policy, contributing guide, and release notes.

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, TypeScript, TailwindCSS, Framer Motion, React Router, React Hook Form, Zod, Axios, Lucide Icons |
| Backend | FastAPI, Pydantic v2, Motor, PyJWT, Passlib bcrypt, python-dotenv, Uvicorn |
| Database | MongoDB Atlas |
| Testing | Pytest, pytest-cov, Vitest, React Testing Library, V8 coverage |
| Deployment | Vercel frontend, Render backend |

## Architecture

```mermaid
flowchart LR
  Visitor["Visitor"] --> Landing["React Landing Page"]
  Admin["Admin"] --> Login["React Login"]
  Login --> Token["JWT Session"]
  Token --> Dashboard["Protected Dashboard"]
  Landing --> PublicLead["Public Lead API"]
  Dashboard --> ProtectedAPI["Protected API"]
  PublicLead --> FastAPI["FastAPI /api/v1"]
  ProtectedAPI --> FastAPI
  FastAPI --> Guards["Auth, Role Guards, Rate Limits"]
  Guards --> Services["Business Services"]
  Services --> Mongo["MongoDB Atlas"]
  FastAPI --> Logs["Structured Logs"]
```

## Folder Structure

```text
leaddesk-mini/
  frontend/
    public/
    src/
      components/
      components/dashboard/
      context/
      hooks/
      pages/
      router/
      sections/
      services/
      styles/
      test/
      types/
      utils/
    vercel.json
  backend/
    app/
      api/v1/
      core/
      database/
      middleware/
      models/
      schemas/
      services/
      tests/
      utils/
    requirements.txt
    requirements-dev.txt
    main.py
  docs/
  .github/
  render.yaml
```

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+
- MongoDB Atlas connection string

### Installation

```bash
git clone https://github.com/Shibukedang27/leaddesk-mini.git
cd leaddesk-mini
```

```bash
cd frontend
npm install
```

```bash
cd ../backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### Environment

```bash
cp .env.example .env.local.reference
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Frontend:

```bash
VITE_API_URL=http://localhost:8000/api
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_URL=http://localhost:5173
```

Backend:

```bash
APP_NAME=LeadDesk Mini
APP_VERSION=1.0.0
ENVIRONMENT=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leaddesk-mini
JWT_SECRET=replace-with-at-least-32-random-characters
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REQUEST_TIMEOUT_SECONDS=30
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
TRUSTED_HOSTS=localhost,127.0.0.1
ADMIN_EMAIL=admin@leaddesk-mini.dev
ADMIN_PASSWORD=replace-with-a-strong-review-password
ADMIN_FULL_NAME=LeadDesk Admin
```

## Usage

Run the backend:

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload
```

Run the frontend:

```bash
cd frontend
npm run dev
```

Open:

- Landing page: `http://localhost:5173`
- Login page: `http://localhost:5173/login`
- Admin dashboard: `http://localhost:5173/admin`
- Swagger docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`

## Scripts

Frontend:

```bash
npm run dev
npm run lint
npm run test
npm run coverage
npm run build
npm run preview
```

Backend:

```bash
python -m ruff check app main.py
python -m pytest
python -m pytest --cov=app --cov-report=term-missing
python -m compileall app main.py
```

## API

Base URL:

- Local: `http://localhost:8000/api/v1`
- Production: `https://leaddesk-mini-api.onrender.com/api/v1`

Core endpoints:

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | Public | Server and database health |
| `POST` | `/auth/login` | Public | Admin login and JWT issue |
| `GET` | `/auth/me` | Bearer | Current authenticated admin |
| `POST` | `/auth/logout` | Bearer | Stateless logout acknowledgement |
| `GET` | `/dashboard` | Admin | Lead analytics summary |
| `GET` | `/leads` | Admin | Search, filter, sort, paginate leads |
| `POST` | `/leads/public` | Public | Landing page lead capture |
| `POST` | `/leads` | Admin | Create a lead |
| `PATCH` | `/leads/{lead_id}` | Admin | Update lead status or notes |

Full endpoint documentation lives in [docs/API.md](./docs/API.md).

## Authentication

1. Admin submits credentials from `/login`.
2. `POST /api/v1/auth/login` validates email and password.
3. Backend verifies the stored bcrypt hash.
4. Backend signs a JWT with subject, role, token type, issued-at time, and expiration.
5. Frontend stores the token for session restore.
6. Protected requests send `Authorization: Bearer <token>`.
7. Invalid or expired tokens clear the session and redirect to login.

JWT keeps the API stateless across Vercel and Render. bcrypt was selected because it is salted, intentionally slow, mature, and widely reviewed for password storage.

## Database

Collections:

| Collection | Purpose |
| --- | --- |
| `users` | Admin accounts with bcrypt password hashes and role metadata |
| `leads` | CRM lead records submitted publicly or created by admins |

Important indexes:

- `users.email` unique
- `users.role`
- `leads.email` unique
- `leads.status`
- `leads.created_at`
- `leads.status + created_at`

## Testing & Quality

Current verified results:

| Area | Result |
| --- | --- |
| Backend tests | `22 passed` |
| Backend coverage | `83%` overall, `95%` lead service |
| Frontend tests | `21 passed` |
| Frontend coverage | `68%` baseline |
| Frontend audit | `0 vulnerabilities` with `npm audit --omit=dev` |
| Production build | Passing |

Testing guide: [docs/TESTING.md](./docs/TESTING.md).

## Deployment

Frontend target: Vercel.

- Project root: `frontend`
- Build command: `npm ci && npm run build`
- Output directory: `dist`
- Required variable: `VITE_API_URL=https://leaddesk-mini-api.onrender.com/api`

Backend target: Render.

- Blueprint: [render.yaml](./render.yaml)
- Health check: `/api/v1/health`
- Required secrets: `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

Database target: MongoDB Atlas.

- Use a dedicated database user.
- Restrict network access according to your deployment policy.
- Store the Atlas URI only in Render environment variables.

Deployment checklist: [docs/DEPLOYMENT_CHECKLIST.md](./docs/DEPLOYMENT_CHECKLIST.md).

## Security

- No secrets are committed.
- JWT secrets are validated for minimum length.
- Passwords are stored only as bcrypt hashes.
- Admin APIs use reusable role guards.
- Login and public lead capture are rate limited.
- CORS allows only configured origins.
- Trusted Host middleware rejects unexpected hosts.
- Security headers reduce browser attack surface.
- Validation errors are sanitized.
- Centralized exception handlers hide stack traces.

Security policy: [SECURITY.md](./SECURITY.md).

## Repository Metadata

Suggested repository description:

```text
Premium lead management CRM built with React, FastAPI, MongoDB Atlas, JWT auth, and production-ready deployment.
```

Suggested topics:

```text
react, vite, typescript, tailwindcss, fastapi, mongodb, motor, jwt-auth, crm, dashboard, saas, vercel, render, pytest, vitest
```

Suggested labels are defined in [.github/labels.yml](./.github/labels.yml).

## Release

Current release: `v1.0.0`

Release notes: [RELEASE_NOTES.md](./RELEASE_NOTES.md).

Suggested tag command:

```bash
git tag -a v1.0.0 -m "Release LeadDesk Mini v1.0.0"
git push origin v1.0.0
```

## Roadmap

- Add CI for lint, build, tests, coverage, and dependency scanning.
- Add Playwright smoke tests for login and dashboard flows.
- Add audit history for lead status changes.
- Add Redis-backed rate limiting for multi-instance deployments.
- Add secure HttpOnly cookie session option.
- Add screenshot automation for portfolio assets.

## Acknowledgements

LeadDesk Mini uses React, Vite, TypeScript, TailwindCSS, Framer Motion, FastAPI, Pydantic, Motor, MongoDB Atlas, PyJWT, Passlib bcrypt, Vercel, and Render.

## AI Usage

AI was used for brainstorming, architecture validation, documentation refinement, and code review assistance. Implementation, testing, debugging, and final technical decisions were reviewed manually.

## License

MIT. See [LICENSE](./LICENSE).
