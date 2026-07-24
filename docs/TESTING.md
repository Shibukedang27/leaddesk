# Testing & Quality Assurance

LeadDesk Mini uses automated tests at the backend service/API layer and the frontend route/component layer. The suites are designed to run without MongoDB or a deployed API by using deterministic fakes and mocked network boundaries.

## Backend

Install development dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements-dev.txt
```

Run the backend test suite:

```bash
python -m pytest
```

Run backend coverage:

```bash
python -m pytest --cov=app --cov-report=term-missing --cov-report=html --cov-report=xml
```

Covered areas:

- Authentication password hashing and JWT validation failure modes
- Protected route unauthorized access
- Lead creation, duplicate email handling, validation, search, filtering, sorting, pagination, status updates, and dashboard summary calculations
- Health endpoint success and database-unavailable responses
- Standard error envelopes for validation, 404, 500, and Mongo failures
- Database connection state helpers and graceful disconnect behavior

## Frontend

Install dependencies:

```bash
cd frontend
npm install
```

Run the frontend test suite:

```bash
npm run test
```

Run frontend coverage:

```bash
npm run coverage
```

Covered areas:

- Landing page rendering and public lead form validation/submission
- Login validation, successful navigation, loading guard, and rejected credentials
- Protected route loading, unauthenticated redirect, and authenticated rendering
- Dashboard analytics, lead table, debounced search, pagination, status updates, error retry, and reusable empty/error/modal/toast states
- Accessibility-oriented assertions for labels, ARIA state, dialog semantics, keyboard Escape handling, and status/alert announcements

## Quality Gates

Recommended release checks:

```bash
cd backend
python -m ruff check app main.py
python -m pytest --cov=app --cov-report=term-missing

cd ../frontend
npm run lint
npm run test
npm run coverage
npm run build
npm audit --omit=dev
```

The long-term production target is 90%+ coverage for backend and frontend. The current Phase 09 baseline is 83% backend coverage and 68% frontend coverage, with critical lead-service business logic above 90%. Coverage reports are generated in `backend/htmlcov` and `frontend/coverage`.
