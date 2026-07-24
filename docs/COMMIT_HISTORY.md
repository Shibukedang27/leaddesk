# Suggested Commit History

If this repository is being prepared for a portfolio review, keep the final history readable and intentional. Avoid one giant commit if possible.

## Recommended Commit Sequence

```text
chore: initialize LeadDesk Mini monorepo
feat(frontend): build premium landing page and design system
feat(api): add FastAPI architecture and health checks
feat(database): implement MongoDB lead services and validation
feat(auth): add JWT admin authentication
feat(dashboard): build protected lead management dashboard
chore(deploy): configure Vercel, Render, and production docs
docs: add interview thesis and API documentation
test: add backend and frontend QA coverage
docs: polish GitHub portfolio presentation
```

## Release Tag

```bash
git tag -a v1.0.0 -m "Release LeadDesk Mini v1.0.0"
git push origin v1.0.0
```

## Release Title

```text
LeadDesk Mini v1.0.0 - Portfolio MVP
```

## Release Description

```text
First portfolio-ready release of LeadDesk Mini: a premium lead management CRM with React, FastAPI, MongoDB Atlas, JWT authentication, protected admin dashboard, production deployment configuration, and automated test coverage.
```
