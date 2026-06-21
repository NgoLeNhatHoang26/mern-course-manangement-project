# Course Management System

Hệ thống quản lý khoá học trực tuyến xây dựng bằng MERN stack — cho phép người dùng đăng ký, xem, đánh giá khoá học; admin quản lý toàn bộ nội dung và người dùng.

---

### 3. Chạy Backend

```bash
cd backend
npm install
npm run dev
# → http://localhost:5000
# → Swagger UI: http://localhost:5000/api-docs
```

### 4. Chạy Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## Chạy bằng Docker Compose

```bash
# Build và khởi động tất cả services
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

> Cần tạo file `.env` ở root trước khi chạy Docker (backend đọc `env_file: .env`).

---

## Scripts

### Backend (`cd backend`)

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy development với hot-reload (tsx watch) |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Chạy production build |
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
└── docker-compose.yml
```

---

## API Documentation

Swagger UI tự động sinh từ JSDoc trong `backend/src/doc/`:

```
http://localhost:5000/api-docs
```

| Nhóm | Endpoints |
|------|-----------|
| Auth | register, login, refresh, logout, me, forgot/reset password |
| Courses | CRUD khoá học, lọc/tìm kiếm |
| Modules | CRUD chương học (nested dưới course) |
| Lessons | CRUD bài học + upload video |
| Enrollments | Đăng ký, kiểm tra, danh sách |
| Reviews | CRUD đánh giá (auto recalc rating) |
| Users | Hồ sơ cá nhân |
| Admin | Dashboard, quản lý user, phân quyền |

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
| `REDIS_URL` | | — | Redis URL (nếu không có, cache bị tắt) |
| `CLIENT_URL` | | `http://localhost:3000` | Origin frontend (CORS) |
| `MAIL_USER` | | — | Gmail để gửi email reset password |
| `MAIL_PASS` | | — | App password Gmail |
| `CLOUDINARY_CLOUD_NAME` | | — | Cloudinary (upload ảnh/video) |
| `CLOUDINARY_API_KEY` | | — | Cloudinary |
| `CLOUDINARY_API_SECRET` | | — | Cloudinary |

---

## Tài liệu

- [Kiến trúc hệ thống](docs/ARCHITECTURE.md)
- [Database schema](docs/DATABASE.md)
- [API Reference](http://localhost:5000/api-docs)
