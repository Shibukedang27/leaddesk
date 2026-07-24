# API Documentation

Base URL:

- Local: `http://localhost:8000/api/v1`
- Production: `https://leaddesk-mini-api.onrender.com/api/v1`

All responses use the same envelope.

Success:

```json
{
  "success": true,
  "message": "Operation completed.",
  "data": {},
  "timestamp": "2026-07-24T00:00:00+00:00"
}
```

Error:

```json
{
  "success": false,
  "message": "Request failed.",
  "errors": null,
  "timestamp": "2026-07-24T00:00:00+00:00"
}
```

## Endpoints

### GET `/health`

Authentication: none.

Returns server, database, version, environment, and response time.

Errors:

- `503`: MongoDB is unavailable.

### POST `/auth/login`

Authentication: none.

Request:

```json
{
  "email": "admin@leaddesk-mini.dev",
  "password": "review-password-from-environment"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "access_token": "jwt",
    "token_type": "bearer",
    "expires_in": 1800,
    "user": {
      "id": "user-id",
      "email": "admin@leaddesk-mini.dev",
      "full_name": "LeadDesk Admin",
      "role": "ADMIN",
      "is_active": true
    }
  },
  "timestamp": "2026-07-24T00:00:00+00:00"
}
```

Errors:

- `401`: Invalid credentials, inactive account, expired token.
- `422`: Validation failure.
- `429`: Too many login attempts.

### GET `/auth/me`

Authentication: Bearer token.

Returns the authenticated admin user.

Errors:

- `401`: Missing, malformed, invalid, or expired token.

### POST `/auth/logout`

Authentication: Bearer token.

Acknowledges logout. Clients must delete the stored token.

Errors:

- `401`: Missing, malformed, invalid, or expired token.

### GET `/dashboard`

Authentication: ADMIN bearer token.

Returns dynamic lead counts, recent leads, and latest activity.

Errors:

- `401`: Missing or invalid token.
- `403`: Authenticated user lacks the required role.
- `503`: Database unavailable.

### GET `/leads`

Authentication: ADMIN bearer token.

Query parameters:

- `page`: integer, default `1`.
- `limit`: integer from `1` to `100`, default `10`.
- `search`: optional partial name or email.
- `status`: optional `NEW`, `CONTACTED`, or `CLOSED`.
- `sort`: `newest`, `oldest`, `budget`, `alphabetical`, or `status`.

Returns a paginated lead array and pagination metadata.

Errors:

- `401`, `403`, `422`, `503`.

### GET `/leads/{lead_id}`

Authentication: ADMIN bearer token.

Returns one lead by MongoDB ObjectId.

Errors:

- `400`: Invalid ObjectId.
- `404`: Lead not found.
- `401`, `403`, `503`.

### POST `/leads/public`

Authentication: none.

Submits a public lead request from the landing page contact form.

Request:

```json
{
  "full_name": "Avery Stone",
  "email": "avery@example.com",
  "budget": "$15k - $50k",
  "message": "Interested in a CRM rollout for a small sales team.",
  "source": "landing"
}
```

Errors:

- `409`: Duplicate lead email.
- `422`: Validation failure.
- `429`: Too many lead requests.
- `503`: Database unavailable.

### POST `/leads`

Authentication: ADMIN bearer token.

Request:

```json
{
  "full_name": "Avery Stone",
  "email": "avery@example.com",
  "budget": "$15k-$50k",
  "message": "Interested in a CRM rollout for a small sales team.",
  "source": "Website",
  "notes": "Requested follow-up next week."
}
```

Errors:

- `409`: Duplicate lead email.
- `422`: Validation failure.
- `401`, `403`, `503`.

### PATCH `/leads/{lead_id}`

Authentication: ADMIN bearer token.

Request:

```json
{
  "status": "CONTACTED",
  "notes": "Sent proposal."
}
```

Errors:

- `400`: Invalid ObjectId.
- `404`: Lead not found.
- `422`: Invalid status or payload.
- `401`, `403`, `503`.
