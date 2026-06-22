# Course Management System

Hệ thống quản lý khoá học trực tuyến xây dựng bằng MERN stack — cho phép người dùng đăng ký, xem, đánh giá khoá học; admin quản lý toàn bộ nội dung và người dùng.

---

## Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | React 19, Vite 7, Material UI 7, React Router 7, Axios, Recharts |
| **Backend** | Node.js, Express 5, TypeScript, Zod (validation), Pino (logging) |
| **Database** | MongoDB (Mongoose 8) |
| **Cache** | Redis 7 (ioredis) — tuỳ chọn |
| **Auth** | JWT access token (15 phút) + HttpOnly refresh cookie (7 ngày) |
| **File upload** | Cloudinary (ảnh thumbnail, video bài học) — tuỳ chọn |
| **Email** | Nodemailer (reset password) — tuỳ chọn |
| **Testing** | Vitest, Supertest, MongoDB Memory Server, Testing Library |
| **DevOps** | Docker Compose, Nginx, GitHub Actions CI |
| **API Docs** | Swagger UI (`/api-docs`) |

---

## Tính năng

- Đăng ký / đăng nhập, refresh token tự động, quên mật khẩu qua email
- Xem danh sách và chi tiết khoá học, lọc theo cấp độ, tìm kiếm theo tên
- Đăng ký khoá học, theo dõi tiến độ học
- Xem bài học theo chương, xem trước (preview) bài học miễn phí
- Đánh giá và nhận xét khoá học (rating tự động tính lại)
- Admin: quản lý khoá học, chương học, bài học, người dùng, dashboard thống kê

---

## Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---------|---------------------|
| Node.js | 20+ |
| npm | 9+ |
| MongoDB | 6+ (local hoặc Atlas) |
| Redis | 7+ (tuỳ chọn — app chạy được khi không có Redis) |
| Docker | 24+ (nếu chạy qua Docker Compose) |

---

## Cài đặt & Chạy local

### 1. Clone repo

```bash
git clone <repo-url>
cd mern-course-management-project
```

### 2. Tạo file `.env` ở root

```bash
cp .env.example .env
```

Chỉnh sửa `.env` theo môi trường của bạn. Ví dụ chạy local:

```env
NODE_ENV=development
PORT=5000

JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_EXPIRES=15m

MONGODB_URI=mongodb://127.0.0.1:27017/course-management

# Tuỳ chọn — bật Redis cache & rate limit store
# REDIS_URL=redis://127.0.0.1:6379

CLIENT_URL=http://localhost:3000

# Tuỳ chọn — gửi email reset password
# MAIL_USER=your-gmail@gmail.com
# MAIL_PASS=your-app-password

# Tuỳ chọn — upload ảnh/video lên Cloudinary
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
```

> Backend đọc `.env` từ thư mục root hoặc `backend/.env`. Các biến có default an toàn cho development; **bắt buộc đổi `JWT_SECRET` và `JWT_REFRESH_SECRET` trước khi deploy production**.

### 3. Tạo file `.env` cho frontend

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Cài dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 5. Seed dữ liệu mẫu (tuỳ chọn)

Cần MongoDB đang chạy và `MONGODB_URI` hợp lệ trong `.env`.

```bash
cd backend
npm run seed
```

Script sẽ **xóa toàn bộ dữ liệu cũ** trong DB rồi tạo lại dữ liệu demo:

| Email | Role | Mật khẩu |
|-------|------|----------|
| `admin@example.com` | admin | `Password123!` |
| `student1@example.com` | user | `Password123!` |
| `student2@example.com` | user | `Password123!` |

Bao gồm 2 khoá học, modules, lessons, enrollments và reviews.

> **Chỉ chạy trên môi trường dev/local.** Không chạy seed trên database production.

### 6. Chạy Backend

```bash
cd backend
npm run dev
# → http://localhost:5000
# → Swagger UI: http://localhost:5000/api-docs
```

### 7. Chạy Frontend

Mở terminal mới:

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

---

## Chạy bằng Docker Compose

```bash
# Tạo .env ở root trước (xem bước 2 ở trên)
docker compose up --build

# Chạy ngầm
docker compose up -d --build

# Dừng
docker compose down
```

**Services:**

| Service | Địa chỉ |
|---------|---------|
| Frontend (Nginx) | http://localhost:80 |
| Backend API | http://localhost:5000 (internal) |
| Redis | port 6379 (internal) |

> Docker Compose load biến môi trường từ `.env` ở root. Nếu dùng Redis trong Docker, đặt `REDIS_URL=redis://redis:6379`.

---

## Scripts

### Backend (`cd backend`)

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development với hot-reload (tsx watch) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Chạy production build |
| `npm run seed` | Nạp dữ liệu mẫu vào MongoDB (dev only) |
| `npm run test:run` | Chạy toàn bộ test một lần |
| `npm test` | Chạy test ở watch mode |

### Frontend (`cd frontend`)

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development server (Vite) |
| `npm run build` | Build production → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Kiểm tra ESLint |
| `npm test` | Chạy test một lần (Vitest) |
| `npm run test:watch` | Chạy test ở watch mode |

---

## Kiểm thử (Testing)

Backend sử dụng **Vitest** với hai lớp test:

| Loại | Vị trí | Mô tả |
|------|--------|-------|
| Unit test | `backend/src/**/__tests__/*.unit.test.ts` | Service, middleware, lib |
| Integration test | `backend/src/routes/__tests__/*.integration.test.ts` | Route + middleware (Supertest) |

```bash
cd backend
npm run test:run
```

CI tự động chạy test khi push/PR qua GitHub Actions (`.github/workflows/course-management-ci.yml`).

---

## Cấu trúc thư mục

```
mern-course-management-project/
├── backend/
│   ├── src/
│   │   ├── app.ts               # Express app (middleware, routes)
│   │   ├── server.ts            # Entry point (connect DB, start server)
│   │   ├── config/              # env, swagger, cloudinary, mailer, logger
│   │   ├── controller/          # Nhận request, gọi service, trả response
│   │   ├── services/            # Business logic
│   │   ├── models/              # Mongoose models
│   │   ├── routes/              # Express routers
│   │   ├── scripts/             # seed.ts — nạp dữ liệu mẫu
│   │   ├── middleware/          # auth, validate, rateLimit, error, responseFormat
│   │   ├── schemas/             # Zod validation schemas
│   │   ├── doc/                 # Swagger JSDoc cho từng domain
│   │   ├── utils/               # AppError, helpers
│   │   └── lib/                 # db.ts, redis.ts
│   ├── test/                    # Global test setup (env, db)
│   ├── docs/                    # Test plans & scenarios
│   └── vitest.config.ts
│
├── frontend/
│   ├── src/
│   │   ├── features/            # Feature-based structure
│   │   │   ├── auth/            # context, hooks, services, schemas, types
│   │   │   ├── courses/         # components, hooks, services, types
│   │   │   ├── lessons/         # components, hooks, services, types
│   │   │   ├── reviews/         # components, services, types
│   │   │   ├── enrollment/      # hooks, services
│   │   │   └── admin/           # hooks, services, types
│   │   ├── pages/               # Route-level components
│   │   ├── layout/              # Header, Footer, Sidebar, AuthSection…
│   │   ├── components/          # Shared UI components
│   │   ├── lib/                 # api.ts (axios + interceptors)
│   │   ├── constants/           # Routes, keys…
│   │   ├── theme/               # MUI theme
│   │   └── hooks/               # Shared hooks (useDebounce…)
│   └── nginx/                   # Nginx config (production)
│
├── docs/
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
├── .env.example                 # Template biến môi trường backend
├── frontend/.env.example        # Template biến môi trường frontend
└── docker-compose.yml
```

---

## Kiến trúc Backend

```
Client → Routes → Controller → Service → Model (Mongoose)
                  ↓
            Middleware: auth, role, validate, rateLimit, error
```

- **Controller:** nhận HTTP request, gọi service, trả response
- **Service:** business logic, gọi Mongoose model
- **Model:** schema, index, hooks (ví dụ auto cập nhật `studentCount`, `ratingAverage`)
- **Middleware:** xác thực JWT, phân quyền role, validate Zod, rate limiting, format response

Chi tiết: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## API Documentation

Swagger UI tự động sinh từ JSDoc trong `backend/src/doc/`:

```
http://localhost:5000/api-docs
```

| Nhóm | Base path | Mô tả |
|------|-----------|-------|
| Auth | `/api/auth` | register, login, refresh, logout, me, forgot/reset password |
| Courses | `/api/courses` | CRUD khoá học, lọc/tìm kiếm (`?search=&level=`) |
| Modules | `/api/courses/:courseId/modules` | CRUD chương học |
| Lessons | `/api/courses/:courseId/modules/:moduleId/lessons` | CRUD bài học + upload video |
| Enrollments | `/api/enrollments` | Đăng ký, kiểm tra, danh sách của user |
| Reviews | `/api/courses/:courseId/reviews` | CRUD đánh giá (auto recalc rating) |
| Users | `/api/users` | Hồ sơ cá nhân |
| Admin | `/api/admin` | Dashboard, quản lý user, phân quyền |
| Health | `/api/health` | Health check |

**Response format chuẩn:**

```json
// Thành công
{ "success": true, "data": { ... } }

// Lỗi
{ "success": false, "message": "...", "code": "NOT_FOUND", "errors": [...] }
```

---

## Database

MongoDB database tên `course-management`, gồm 6 collections:

| Collection | Mô tả |
|------------|-------|
| `users` | Tài khoản, role (`user` / `admin`) |
| `courses` | Khoá học |
| `lessonmodules` | Chương học thuộc khoá |
| `lessons` | Bài học thuộc chương |
| `enrollments` | User ↔ Course (N–N, unique per pair) |
| `reviews` | Đánh giá khoá học (unique per user+course) |

Schema, indexes và luồng dữ liệu: [docs/DATABASE.md](docs/DATABASE.md)

---

## Biến môi trường — tham chiếu đầy đủ

| Biến | Bắt buộc | Mặc định | Mô tả |
|------|----------|----------|-------|
| `NODE_ENV` | | `development` | `development` / `test` / `production` |
| `PORT` | | `5000` | Port backend |
| `JWT_SECRET` | | `dev-jwt-secret` | **Thay bằng secret mạnh trong production** |
| `JWT_REFRESH_SECRET` | | `dev-refresh-secret` | **Thay bằng secret mạnh trong production** |
| `JWT_EXPIRES` | | `15m` | Thời hạn access token |
| `MONGODB_URI` | | `mongodb://127.0.0.1:27017/course-management` | MongoDB connection string |
| `REDIS_URL` | | — | Redis URL (nếu không có, cache & rate-limit store in-memory) |
| `CLIENT_URL` | | `http://localhost:3000` | Origin frontend (CORS + link reset password) |
| `MAIL_USER` | | — | Gmail để gửi email reset password |
| `MAIL_PASS` | | — | App password Gmail |
| `CLOUDINARY_CLOUD_NAME` | | — | Cloudinary (upload ảnh/video) |
| `CLOUDINARY_API_KEY` | | — | Cloudinary |
| `CLOUDINARY_API_SECRET` | | — | Cloudinary |

**Frontend** (`frontend/.env`):

| Biến | Mô tả |
|------|-------|
| `VITE_API_URL` | Base URL backend, gồm prefix `/api` (mặc định proxy: `http://localhost:5000/api`) |

---

## Tài liệu

- [Kiến trúc hệ thống](docs/ARCHITECTURE.md)
- [Database schema](docs/DATABASE.md)
- [API Reference (Swagger)](http://localhost:5000/api-docs)
