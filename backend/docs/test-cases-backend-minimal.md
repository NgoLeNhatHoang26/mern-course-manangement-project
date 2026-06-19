# Backend Test Cases 

## Auth Cases

- ID: TC-AUTH-REGISTER-001
  - Scenario: SCN-AUTH-01
  - Type: Integration
  - Input: `POST /api/auth/register` with invalid email/password payload
  - Expected:
    - Status `400`
    - `success = false`
    - `message = "Dữ liệu không hợp lệ"`

- ID: TC-AUTH-REGISTER-002
  - Scenario: SCN-AUTH-01
  - Type: Integration
  - Input: valid register payload
  - Expected:
    - Status `201`
    - `success = true`
    - response `data.message` indicates registration success

- ID: TC-AUTH-LOGIN-001
  - Scenario: SCN-AUTH-02
  - Type: Unit (service)
  - Input: existing user + correct password
  - Expected:
    - returns `token`, `refreshToken`, and `user`
    - refresh token persisted to user record

- ID: TC-AUTH-LOGIN-002
  - Scenario: SCN-AUTH-02
  - Type: Unit (service)
  - Input: valid email + wrong password
  - Expected:
    - throws `Invalid email or password`

- ID: TC-AUTH-ME-001
  - Scenario: SCN-AUTH-04
  - Type: Integration
  - Input: `GET /api/auth/me` without token
  - Expected:
    - Status `401`
    - unauthorized message

## Enrollment Cases

- ID: TC-ENR-ENROLL-001
  - Scenario: SCN-ENR-01
  - Type: Unit (service)
  - Input: valid `userId` + `courseId`
  - Expected:
    - enrollment record created once

- ID: TC-ENR-ENROLL-002
  - Scenario: SCN-ENR-02
  - Type: Unit (service)
  - Input: same user enrolls same course twice
  - Expected:
    - second call fails with duplicate enrollment error
    - no second record created

- ID: TC-ENR-ME-001
  - Scenario: SCN-ENR-03
  - Type: Integration
  - Input: `GET /api/enrollments/me` with valid auth
  - Expected:
    - Status `200`
    - returns current user enrollments only

## Courses Cases

- ID: TC-COURSE-LIST-001
  - Scenario: SCN-COURSE-01
  - Type: Unit (service)
  - Input: list request with `search` and `level`
  - Expected:
    - query applies both filters correctly

- ID: TC-COURSE-CREATE-001
  - Scenario: SCN-COURSE-03
  - Type: Integration
  - Input: admin token + valid course payload
  - Expected:
    - Status `201` (or project-defined success code)
    - created course returned

- ID: TC-COURSE-CREATE-002
  - Scenario: SCN-COURSE-04
  - Type: Integration
  - Input: non-admin token + valid course payload
  - Expected:
    - Status `403` (or project-defined forbidden code)

## Review Cases

- ID: TC-REV-CREATE-001
  - Scenario: SCN-REV-02
  - Type: Integration
  - Input: authenticated user creates review
  - Expected:
    - Status `201`/`200` per implementation
    - review includes user and course reference

- ID: TC-REV-DELETE-001
  - Scenario: SCN-REV-04
  - Type: Unit (service)
  - Input: non-owner user tries deleting review
  - Expected:
    - action rejected with permission error

## Middleware / Platform Cases

- ID: TC-MW-AUTH-001
  - Scenario: SCN-MW-01
  - Type: Unit
  - Input: missing authorization header
  - Expected:
    - Status `401`
    - next() not called

- ID: TC-MW-VALIDATE-001
  - Scenario: SCN-MW-03
  - Type: Integration
  - Input: invalid body to schema-protected route
  - Expected:
    - Status `400`
    - `errors[]` includes field and message

- ID: TC-HEALTH-001
  - Scenario: SCN-PLATFORM-01
  - Type: Integration
  - Input: `GET /health`
  - Expected:
    - Status `200`
    - `data.status = "UP"`
    - `data.timestamp` is string
    - `data.uptime` is number

---

## Suggested First Sprint (P0 only)

Implement first these IDs:

- `TC-AUTH-REGISTER-001`
- `TC-AUTH-REGISTER-002`
- `TC-AUTH-LOGIN-001`
- `TC-AUTH-LOGIN-002`
- `TC-MW-AUTH-001`
- `TC-ENR-ENROLL-001`
- `TC-ENR-ENROLL-002`
- `TC-HEALTH-001`
