# Contributing

Thank you for taking the time to improve LeadDesk Mini. This repository is maintained as a production-style portfolio project, so contributions should preserve clarity, security, accessibility, and deployability.

## Ways To Contribute

- Report reproducible bugs.
- Suggest focused product improvements.
- Improve documentation, tests, accessibility, or deployment guidance.
- Refactor code only when it meaningfully improves readability, correctness, or maintainability.

## Development Standards

- Keep frontend code typed, accessible, responsive, and aligned with the Tailwind design tokens.
- Keep backend routes thin; place business rules in services.
- Validate input with Zod on the frontend and Pydantic on the backend.
- Preserve the standard API response envelope.
- Never commit secrets, JWTs, passwords, database URLs, `.env` files, or private user data.
- Prefer small pull requests with a clear summary and validation notes.

## Local Setup

```bash
git clone https://github.com/Shibukedang27/leaddesk-mini.git
cd leaddesk-mini
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
uvicorn main:app --reload
```

Copy environment files from `.env.example` and use local-only values.

## Quality Checks

Run these before opening a pull request:

```bash
cd frontend
npm run format
npm run lint
npm run test
npm run coverage
npm run build
npm audit --omit=dev
```

```bash
cd backend
python -m ruff check app main.py
python -m pytest
python -m compileall app main.py
```

## Pull Request Guidelines

- Keep the title specific and readable.
- Link related issues when possible.
- Include screenshots for UI changes.
- Include API examples for endpoint changes.
- Mention migrations, indexes, environment variables, or deployment steps.
- State what was tested.

## Commit Style

Use concise, professional commit messages:

```text
feat(frontend): add dashboard lead status workflow
fix(api): normalize validation error envelopes
test(backend): cover lead search and pagination
docs: polish deployment checklist
```

Suggested release history is documented in [docs/COMMIT_HISTORY.md](./docs/COMMIT_HISTORY.md).
