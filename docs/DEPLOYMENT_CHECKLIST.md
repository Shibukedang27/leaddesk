# Deployment Checklist

## MongoDB Atlas

- [ ] Create a MongoDB Atlas cluster.
- [ ] Create a database user with a strong password.
- [ ] Restrict network access to Render outbound access or the required IP policy.
- [ ] Copy the connection string into Render as `MONGODB_URI`.
- [ ] Confirm indexes are created on startup.

## Render Backend

- [ ] Create the web service from `render.yaml`.
- [ ] Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` as secret environment variables.
- [ ] Confirm `ENVIRONMENT=production`.
- [ ] Confirm `CORS_ORIGINS` contains the Vercel production URL.
- [ ] Confirm `TRUSTED_HOSTS` contains the Render hostname.
- [ ] Open `/api/v1/health` and verify database status is `connected`.

## Vercel Frontend

- [ ] Set the Vercel project root to `frontend`.
- [ ] Set `VITE_API_URL=https://leaddesk-mini-api.onrender.com/api`.
- [ ] Confirm the build command is `npm ci && npm run build`.
- [ ] Confirm the output directory is `dist`.
- [ ] Confirm `/admin` reloads correctly through the SPA rewrite.

## Security

- [ ] Use a random `JWT_SECRET` with at least 32 characters.
- [ ] Use a strong review admin password.
- [ ] Never expose JWTs, database URLs, or passwords in screenshots or logs.
- [ ] Confirm CORS rejects unlisted origins.
- [ ] Confirm 401 and 403 responses do not expose stack traces.

## Final Review

- [ ] Frontend format, lint, and build pass.
- [ ] Backend import and compile checks pass.
- [ ] README, API docs, license, contributing guide, and GitHub templates are present.
- [ ] Lighthouse review targets 95+ for Performance, Accessibility, Best Practices, and SEO.
