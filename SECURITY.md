# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| `v1.0.x` | Yes |

## Reporting A Vulnerability

Please do not open a public issue for security vulnerabilities.

Report privately through GitHub Security Advisories or by contacting the repository owner through their GitHub profile. Include:

- A clear description of the vulnerability.
- Steps to reproduce.
- Affected routes, components, or configuration.
- Potential impact.
- Suggested remediation, if known.

## Security Expectations

- Never share JWTs, passwords, database URLs, `.env` files, production logs, or private data.
- Rotate any credential that may have been exposed.
- Validate all frontend and backend input.
- Keep dependencies current and review security advisories before deployment.

## Current Security Controls

- bcrypt password hashing.
- JWT expiration and role claims.
- Admin route guards.
- Login and public lead rate limiting.
- CORS allowlist.
- Trusted host validation.
- Security headers.
- Centralized sanitized error responses.
- MongoDB Atlas connection through environment variables.
