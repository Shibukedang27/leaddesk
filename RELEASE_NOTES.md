# Release Notes

## v1.0.0 - Portfolio MVP

Release date: 2026-07-24

LeadDesk Mini v1.0.0 is the first portfolio-ready release of the application. It includes a premium public landing page, secure admin authentication, a protected CRM dashboard, MongoDB-backed lead management, deployment configuration, and automated tests.

### Highlights

- React, Vite, TypeScript, and TailwindCSS frontend.
- Premium SaaS-style admin dashboard with analytics cards, lead table, search, filters, pagination, status updates, modals, toasts, loading states, empty states, and error states.
- FastAPI backend with clean API versioning under `/api/v1`.
- MongoDB Atlas integration through Motor.
- JWT authentication with bcrypt password hashing.
- Reusable backend service layer for leads, dashboard data, users, and authentication.
- Standard API response envelope.
- CORS, trusted hosts, security headers, compression, request logging, rate limiting, and request timeout middleware.
- Public lead capture endpoint and protected admin lead management endpoints.
- Vercel and Render deployment configuration.
- GitHub community files for open-source readiness.
- Pytest and Vitest test suites.

### Verification

- Backend tests: `22 passed`
- Backend coverage: `83%`
- Frontend tests: `21 passed`
- Frontend coverage: `68%`
- Frontend production build: passing
- Frontend dependency audit: `0 vulnerabilities`

### Known Follow-Ups

- Add CI workflow for lint, tests, build, and dependency scanning.
- Add Playwright smoke tests for login and dashboard flows.
- Add screenshot automation for README assets.
- Expand frontend coverage for API services and AuthContext.
- Add Redis-backed rate limiting for multi-instance backend deployments.

### Release Tag

Suggested command:

```bash
git tag -a v1.0.0 -m "Release LeadDesk Mini v1.0.0"
git push origin v1.0.0
```
