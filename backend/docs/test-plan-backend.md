# Backend Test Plan (Minimal)

## 1) Objective

- Ensure core backend flows work correctly and safely before release.
- Use this plan as the source to implement unit and integration tests in Vitest.

## 2) Scope

- In scope:
  - Auth (`/api/auth`)
  - Courses (`/api/courses`)
  - Enrollment (`/api/enrollments`)
  - Reviews (`/api/reviews`)
  - Access control middleware (`auth`, `role`, `validate`)
  - Health endpoint (`/health`)
- Out of scope (minimal phase):
  - Real Cloudinary upload flow
  - Real email sending flow (mailer mocked)
  - Real Redis infra behavior (store errors mocked/isolated)

## 3) Test Levels

- Unit tests:
  - Service business logic with model/dependency mocks.
  - Middleware behavior with request/response mocks.
- Integration tests:
  - Route + middleware + app wiring via `supertest`.
  - Validate status codes and response contract (`success`, `data`, `message`).

## 4) Test Environment

- Framework: `vitest`
- HTTP testing: `supertest`
- DB test approach:
  - Prefer isolated test DB or mocked model layer per suite.
  - Reset state between tests.
- Required env (test-safe values):
  - `JWT_SECRET`
  - `JWT_REFRESH_SECRET`
  - `JWT_EXPIRES`
  - Optional: `REDIS_URL` unset for fallback tests.

## 5) Entry / Exit Criteria

- Entry criteria:
  - Backend installs and runs tests locally.
  - Required env for auth tests is configured.
- Exit criteria:
  - All P0 scenarios pass.
  - No failing test in auth/enrollment/security middleware suites.
  - Critical regressions blocked from merge.

## 6) Priority

- P0:
  - Auth login/register/refresh/me
  - Enrollment guard against duplicate enroll
  - Auth + role middleware security paths
- P1:
  - Courses and reviews CRUD core paths
- P2:
  - Rate limit edge cases, uncommon error branches

## 7) Mapping Rule (Doc -> Code)

- Each test case ID maps to exactly one `it(...)`.
- Naming format:
  - `TC-<DOMAIN>-<FEATURE>-<NNN>`
- Include case ID in test title for traceability.
