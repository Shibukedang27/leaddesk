# Changelog

All notable changes to LeadDesk Mini are documented here.

## [1.0.0] - 2026-07-24

### Added

- Production-ready React frontend with premium landing page and admin dashboard.
- FastAPI backend with versioned API routes.
- MongoDB Atlas connection management, health checks, indexes, and async services.
- JWT authentication and bcrypt password verification.
- Lead creation, search, filtering, sorting, pagination, status updates, and dashboard summary.
- Public landing-page lead capture endpoint.
- Centralized success and error response envelopes.
- Security middleware, rate limiting, request logging, compression, CORS, and trusted hosts.
- Vercel frontend configuration and Render backend blueprint.
- Backend Pytest suite and frontend Vitest suite.
- GitHub community files, security policy, release notes, and portfolio documentation.

### Changed

- Improved form accessibility by separating labels from validation messages.
- Aligned testing configuration with production TypeScript builds.
- Documented repository metadata, labels, screenshots, and release flow.

### Security

- No secrets committed.
- Environment-driven JWT, MongoDB, CORS, and admin credentials.
- Sanitized validation and server error responses.
