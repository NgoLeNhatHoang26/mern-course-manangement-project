# Architecture

## 1. Tổng quan hệ thống

```
                        ┌─────────────────────────────────────┐
                        │             Browser / Client         │
                        └────────────────┬────────────────────┘
                                         │ HTTP / HTTPS
                        ┌────────────────▼────────────────────┐
                        │              Nginx                   │
                        │   (port 80 — production only)        │
                        │  /         → serve React SPA         │
                        │  /api/*    → proxy → backend:5000    │
                        └──────┬────────────────┬─────────────┘
                               │                │
               ┌───────────────▼──┐    ┌────────▼────────────┐
               │  Frontend (Vite) │    │   Backend (Express)  │
               │  React 19 / MUI  │    │   Node.js / TypeScript│
               │  port 3000 (dev) │    │   port 5000           │
               └──────────────────┘    └───────┬──────────────┘
                                               │
                          ┌────────────────────┼────────────────────┐
                          │                    │                    │
               ┌──────────▼──────┐  ┌──────────▼──────┐  ┌─────────▼───────┐
               │    MongoDB       │  │      Redis       │  │   Cloudinary    │
               │  (Mongoose 8)    │  │  (ioredis / 7)   │  │  (ảnh, video)   │
               └─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 2. Backend — Layered Architecture

Mỗi request đi qua các lớp theo thứ tự:

```
HTTP Request
    │
    ▼
[Global Middleware]
    cors, morgan, express.json, cookieParser
    globalRateLimiter (/api/*)
    responseFormatMiddleware (bọc response)
    │
    ▼
[Router]  routes/index.ts  →  routes/*.ts
    │
    ▼
[Route Middleware] (theo từng route)
    authMiddleware      → xác thực JWT
    roleMiddleware      → kiểm tra quyền admin
    validate(schema)    → Zod validation
    authRateLimiter     → giới hạn auth endpoints
    uploadImage/Video   → Cloudinary multer
    │
    ▼
[Controller]  controller/*.ts
    Nhận req/res, gọi service, trả kết quả
    Không chứa business logic
    │
    ▼
[Service]  services/*.ts
    Business logic thuần túy
    Giao tiếp với Model, Redis, Cloudinary, Mailer
    Ném AppError khi gặp lỗi nghiệp vụ
    │
    ▼
[Model]  models/*.ts
    Mongoose schema + hooks tự động
    (enrollment → update studentCount)
    (review → recalc ratingAverage)
    │
    ▼
[Error Middleware]  middleware/error.middleware.ts
    Bắt mọi lỗi, map sang HTTP status + error code
```

### Middleware quan trọng

| Middleware | Vị trí | Vai trò |
|------------|--------|---------|
| `responseFormatMiddleware` | Global, trước routes | Bọc **mọi** response thành `{ success, data, message, meta }` |
| `errorMiddleware` | Cuối cùng sau routes | Bắt lỗi, trả `{ success: false, message, code, errors }` |
| `authMiddleware` | Per-route | Verify JWT từ `Authorization: Bearer <token>` |
| `roleMiddleware('admin')` | Per-route (sau auth) | Kiểm tra `req.user.role === 'admin'` |
| `validate(zodSchema)` | Per-route | Parse + validate `req.body`, trả 400 nếu sai |
| `globalRateLimiter` | `/api/*` | Giới hạn request chung (Redis-backed) |
| `authRateLimiter` | `/auth/login`, `/auth/register` | Giới hạn chặt hơn cho auth endpoints |

### AppError

```typescript
// Thay thế cho `throw new Error()` trong services
throw new AppError('Course not found', 404);
throw new AppError('Email already exists', 409);
throw new AppError('Forbidden', 403);
```

`errorMiddleware` tự động map `AppError.statusCode` → HTTP status đúng, không cần try/catch ở controller.

---

## 3. API Response Convention

**Mọi response** đều được `responseFormatMiddleware` bọc nhất quán:

### Success (2xx)

```json
{
  "success": true,
  "data": { ... },
  "message": "Thành công",
  "meta": {}
}
```

### Error (4xx / 5xx)

```json
{
  "success": false,
  "message": "Email đã tồn tại",
  "code": "CONFLICT",
  "errors": ["field: message"]
}
```

**Error codes:**

| HTTP Status | Code |
|-------------|------|
| 400 | `BAD_REQUEST` |
| 401 | `UNAUTHORIZED` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` |
| 409 | `CONFLICT` |
| 422 | `UNPROCESSABLE_ENTITY` |
| 429 | `TOO_MANY_REQUESTS` |
| 500 | `INTERNAL_SERVER_ERROR` |

---

## 4. Authentication

### 4.1 Đăng nhập — phát hành token

```
Client                        Backend                        Database
  │                              │                               │
  │  POST /api/auth/login        │                               │
  │  { email, password }         │                               │
  │──────────────────────────►  │                               │
  │                              │  User.findOne({ email })      │
  │                              │──────────────────────────────►│
  │                              │◄──────────────────────────────│
  │                              │  bcrypt.compare(password)     │
  │                              │  jwt.sign → accessToken (15m) │
  │                              │  jwt.sign → refreshToken (7d) │
  │                              │  User.update({ refreshToken })│
  │                              │──────────────────────────────►│
  │  200 { token, user }         │                               │
  │  Set-Cookie: refreshToken    │                               │
  │◄─────────────────────────────│                               │
```

### 4.2 Gọi API có xác thực

```
Client                        Backend
  │                              │
  │  GET /api/auth/me            │
  │  Authorization: Bearer <token>│
  │──────────────────────────►  │
  │                              │  authMiddleware:
  │                              │    verify JWT → decoded.sub
  │                              │    User.findById → req.user
  │  200 { data: user }          │
  │◄─────────────────────────────│
```

### 4.3 Tự động làm mới token (Frontend interceptor)

```
Client                        Backend
  │                              │
  │  GET /api/courses  ──────►  │ 401 (token hết hạn)
  │◄──────────────────────────── │
  │                              │
  │  [axios interceptor bắt 401] │
  │  isRefreshing = true         │
  │  các request khác vào queue  │
  │                              │
  │  POST /api/auth/refresh ───►│
  │  (cookie refreshToken tự gửi)│
  │◄──────────────────────────── │ 200 { accessToken }
  │                              │
  │  lưu accessToken mới         │
  │  flush queue → retry tất cả  │
  │                              │
  │  GET /api/courses ─────────►│ 200
  │◄──────────────────────────── │
```

### 4.4 Quên mật khẩu

```
Client                  Backend                    Email
  │                        │                          │
  │  POST /auth/forgot-password { email }             │
  │───────────────────────►│                          │
  │                        │  tạo resetToken (32 bytes random)
  │                        │  hash SHA-256 → lưu DB (15 phút)
  │                        │  gửi email với raw token ─────────►│
  │  200 (message cố định) │                          │
  │◄───────────────────────│                          │
  │                        │                          │
  │  POST /auth/reset-password { token, password }    │
  │───────────────────────►│                          │
  │                        │  hash token → tìm user có token + chưa hết hạn
  │                        │  bcrypt.hash(password) → lưu
  │                        │  xoá resetPasswordToken khỏi DB
  │  200                   │                          │
  │◄───────────────────────│                          │
```

### 4.5 Role-based access

| Role | Quyền |
|------|-------|
| **guest** (chưa đăng nhập) | Xem danh sách/chi tiết khoá học, xem reviews |
| **user** | + Đăng ký khoá học, xem bài học, tạo/sửa/xóa review của mình |
| **admin** | + CRUD khoá học, chương, bài học; quản lý users, xem dashboard |

---

## 5. Frontend — Feature-based Structure

### Cấu trúc thư mục

```
src/
├── features/               ← Logic theo domain
│   ├── auth/
│   │   ├── context/        AuthContext.tsx (React context)
│   │   ├── hooks/          useAuth.ts
│   │   ├── services/       authService.ts
│   │   ├── schemas/        Zod schemas (validate form)
│   │   ├── types/          auth.types.ts
│   │   └── constants.ts    token keys, storage helpers
│   ├── courses/            hooks, services, components, types
│   ├── lessons/            hooks, services, components, types
│   ├── reviews/            services, components, types
│   ├── enrollment/         hooks, services
│   └── admin/              hooks, services, types
│
├── pages/                  ← Route components (thin, dùng features)
├── layout/                 ← Header, Footer, Sidebar, MainLayout
├── components/             ← Shared UI (BaseForm, FormDialog, ErrorBoundary)
├── lib/
│   └── api.ts              ← Axios instance + interceptors
├── constants/
│   └── routes.ts           ← Route path constants
├── hooks/
│   └── useDebounce.ts      ← Shared hooks
└── theme/
    └── theme.js            ← MUI custom theme
```

### API Client (`lib/api.ts`)

```typescript
// Axios instance có sẵn:
// - baseURL: VITE_API_URL hoặc '/api'
// - withCredentials: true  (cookie tự gửi kèm)
// - request interceptor: tự thêm Authorization header
// - response interceptor:
//     - unwrap { success, data } → trả data trực tiếp
//     - bắt 401 → tự refresh token → retry request gốc
//     - queue các request trong lúc đang refresh
```

---

## 6. Caching (Redis)

| Cache key | Dữ liệu | Invalidation |
|-----------|---------|--------------|
| `courses:all` | Danh sách khoá học | Khi tạo / cập nhật / xóa course |
| `courses:search:<query>` | Kết quả tìm kiếm | Khi tạo / cập nhật / xóa course |

Nếu `REDIS_URL` không được cấu hình, app bỏ qua cache và query MongoDB trực tiếp — không ảnh hưởng chức năng.

Rate limiting (global + auth) cũng sử dụng Redis (`rate-limit-redis`). Nếu không có Redis, rate limiter dùng memory store thay thế.

---

## 7. Docker Deployment

```yaml
# docker-compose.yml — 4 services
services:
  redis:        image: redis:7-alpine
  backend:      build: ./backend        (port 5000 — internal)
  frontend:     build: ./frontend       (build React → /app/dist)
  web-server:   image: nginx:alpine     (port 80 — public)
                  serve /frontend/dist  (React SPA)
                  proxy /api/* → backend:5000
```

**Luồng build production:**

```
1. frontend build (Vite) → dist/
2. nginx serve dist/ tại port 80
3. nginx proxy /api/* đến backend Express
4. backend kết nối MongoDB (Atlas) + Redis
```

---

## 8. Cấu hình môi trường (env.ts)

Toàn bộ biến môi trường được validate bằng Zod khi server khởi động:

```typescript
// Nếu biến thiếu hoặc sai kiểu → server crash ngay lập tức
// với thông báo rõ ràng thay vì fail âm thầm lúc runtime
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}
export const env = parsed.data;
```

Xem đầy đủ danh sách biến trong [README.md](../README.md#biến-môi-trường--tham-chiếu-đầy-đủ).
