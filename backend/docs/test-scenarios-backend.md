# Backend Test Scenarios (Minimal)

## Auth

- SCN-AUTH-01: User registration validation and creation
- SCN-AUTH-02: Login with valid/invalid credentials
- SCN-AUTH-03: Refresh access token with valid/invalid refresh token
- SCN-AUTH-04: Get current user (`/me`) with missing/invalid/valid token
- SCN-AUTH-05: Forgot/reset password flow with valid and expired tokens

## Courses

- SCN-COURSE-01: List courses with optional filters (`search`, `level`)
- SCN-COURSE-02: Get course detail by ID
- SCN-COURSE-03: Admin can create/update/delete course
- SCN-COURSE-04: Non-admin cannot perform admin-only course mutations

## Enrollment

- SCN-ENR-01: Authenticated user enrolls in a course successfully
- SCN-ENR-02: Prevent duplicate enrollment for same user-course pair
- SCN-ENR-03: User fetches own enrollments
- SCN-ENR-04: Check enrollment status by course ID

## Reviews

- SCN-REV-01: Get all reviews by course
- SCN-REV-02: Authenticated user creates review
- SCN-REV-03: Review owner can update/delete own review
- SCN-REV-04: Admin can delete review, non-owner user cannot

## Middleware / Platform

- SCN-MW-01: `auth.middleware` handles missing/expired/invalid token
- SCN-MW-02: `role.middleware` blocks unauthorized role
- SCN-MW-03: `validate.middleware` returns schema errors in expected format
- SCN-MW-04: `responseFormat.middleware` wraps success/error payloads
- SCN-PLATFORM-01: `/health` returns UP status and telemetry fields
