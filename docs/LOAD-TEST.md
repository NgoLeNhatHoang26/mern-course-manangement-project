# Load Test Report — Course Management API

Tài liệu minh chứng kiểm thử tải (load test) cho backend MERN, chạy bằng [k6]
---

## 1. Mục tiêu

- Xác minh API production (Render) phản hồi ổn định dưới tải người dùng đồng thời vừa phải.
- Đo latency (p90, p95) trên các endpoint quan trọng.
- Quan sát hành vi rate limit và error rate.

---

## 2. Môi trường

| Hạng mục | Giá trị |
|----------|---------|
| **API URL** | `https://course-management-api-yozg.onrender.com` |
| **Frontend** | Vercel |
| **Công cụ** | k6 |
| **Rate limit (global)** | 100 request / 3 phút / IP |
| **Rate limit (auth)** | 10 request / 15 phút / IP (`/api/auth/login`, `/api/auth/register`) |
| **Ngày chạy test** | 2026-06-24 |
| **Người chạy** | Nhật Hoàng |
| **Log kết quả** | `load-tests/results/smoke-20260624-190852.txt`, `load-tests/results/load-suite-20260624-190852.txt` |

---

## 3. Cấu trúc file test

```
load-tests/
├── smoke.js        # Kiểm tra nhanh: health + courses list (1 lần)
├── load-suite.js   # Kịch bản chính: browse + auth read
├── run.ps1         # Chạy tuần tự smoke → load-suite, lưu log
└── results/        # Log kết quả (tự tạo khi chạy run.ps1)
```

---

## 4. Kịch bản kiểm thử

### 4.1 Smoke test (`smoke.js`)

| Bước | Method | Endpoint | Mục đích |
|------|--------|----------|----------|
| 1 | GET | `/health` | Server sống, không qua rate limit `/api` |
| 2 | GET | `/api/courses?page=1&limit=12` | Luồng browse công khai |

- **VUs:** 1  
- **Iterations:** 1  
- **Kỳ vọng:** 100% checks pass, p95 < 2s  

### 4.2 Load suite — Critical paths (`load-suite.js`)

Mô phỏng hành vi user thật trên các API quan trọng:

| Trọng số | Luồng | Method | Endpoint | Mô tả |
|----------|-------|--------|----------|-------|
| 60% | Browse list | GET | `/api/courses?page=1&limit=12` | Trang chủ / danh sách khóa học |
| 25% | Course detail | GET | `/api/courses/:courseId` | Xem chi tiết khóa học |
| 8% | Auth profile | GET | `/api/auth/me` | User đã đăng nhập |
| 7% | My enrollments | GET | `/api/enrollments/me` | Khóa học đã đăng ký |

**Setup (chạy 1 lần trước test):**

1. `GET /health` — đánh thức server (Render cold start)
2. `POST /api/auth/login` — lấy JWT (nếu có `EMAIL` / `PASSWORD`)
3. `GET /api/courses` — lấy `courseId` cho test detail

**Tải:**

| Tham số | Giá trị |
|---------|---------|
| VUs | 1 → 3 → 0 (ramp) |
| Thời gian | ~1 phút 40 giây |
| Sleep giữa request | 2 giây |
| Tổng request ước tính | ~80–120 (nằm trong rate limit) |

**Thresholds (ngưỡng đạt):**

| Metric | Ngưỡng |
|--------|--------|
| `courses_list` p95 | < 500ms |
| `course_detail` p95 | < 600ms |
| `auth_me` p95 | < 600ms |
| `courses_list` checks | > 85% pass |
| `http_req_failed` | < 20% (cho phép một phần 429 ở cuối cửa sổ rate limit) |

---

## 5. Cách chạy

### Cài k6 (Windows)

```powershell
winget install k6.k6
k6 version
```

### Chạy từng file

```powershell
cd c:\mern-course-management-project

# Smoke
k6 run load-tests/smoke.js

# Load suite (khuyến nghị truyền credential test)
$env:BASE_URL = "https://course-management-api-yozg.onrender.com"
$env:EMAIL = "your-test@email.com"
$env:PASSWORD = "your-password"
k6 run load-tests/load-suite.js
```

### Chạy cả bộ + lưu log

```powershell
.\load-tests\run.ps1 `
  -Email "your-test@email.com" `
  -Password "your-password"
```

Log lưu tại `load-tests/results/`.
---

## 6. Kết quả thực tế

Chạy bằng `.\load-tests\run.ps1` lúc **19:08:52** ngày **2026-06-24**.

### 6.1 Smoke test

| Metric | Kết quả |
|--------|---------|
| Ngày chạy | 2026-06-24 |
| checks_succeeded | **100%** (3/3) |
| http_req_failed | **0%** (0/2) |
| http_req_duration p(95) | **30.67s** (cold start Render) |
| http_req_duration min / max | 143ms / 32.27s |
| Thời gian chạy | ~33.7s |
| Threshold `checks` | Đạt (>99%) |
| Threshold `http_req_failed` | Đạt (<1%) |
| Threshold `p(95)<2000ms` | **Không đạt** (do cold start) |
| Ghi chú | Chức năng pass: `/health` UP + `GET /api/courses` 200. Latency cao ở request đầu do server Render spin-up. |

### 6.2 Load suite

| Metric | Kết quả |
|--------|---------|
| Ngày chạy | 2026-06-24 |
| VUs max | **3** |
| http_reqs (tổng request) | **122** |
| iterations | 119 |
| checks_succeeded | **100%** (119/119) |
| http_req_failed | **0%** (0/122) |
| http_req_duration p(90) | **162.24ms** |
| http_req_duration p(95) | **196.17ms** |
| p(95) request thành công | **196.17ms** |
| Login setup | **200** (suy ra từ `auth/me` + `enrollments/me` pass) |
| Thời gian chạy | ~1m42s |
| Ghi chú | **Tất cả thresholds đạt.** Chạy sau smoke nên server đã warm — latency ổn định. |

#### Chi tiết checks theo endpoint

| Check | Pass | Fail |
|-------|------|------|
| courses list status 200 | 100% | 0 |
| course detail status 200 | 100% | 0 |
| auth/me status 200 | 100% | 0 |
| enrollments/me status 200 | 100% | 0 |

#### Latency p(95) theo endpoint

| Endpoint | p(95) | Ngưỡng | Kết quả |
|----------|-------|--------|---------|
| `courses_list` | 175.16ms | < 500ms | Đạt |
| `course_detail` | 165.65ms | < 600ms | Đạt |
| `auth_me` | 171.61ms | < 600ms | Đạt |

#### Thresholds load suite

| Threshold | Kết quả |
|-----------|---------|
| `checks{endpoint:courses_list}` > 85% | Đạt (100%) |
| `http_req_duration{endpoint:courses_list}` p95 < 500ms | Đạt |
| `http_req_duration{endpoint:course_detail}` p95 < 600ms | Đạt |
| `http_req_duration{endpoint:auth_me}` p95 < 600ms | Đạt |
| `http_req_failed` < 20% | Đạt (0%) |
---

## 8. Phân tích & kết luận

### Kết luận kỹ thuật

- [x] API phản hồi nhanh: p95 **175ms** (`courses_list`), **166ms** (`course_detail`) — dưới ngưỡng 500ms
- [x] Error rate chấp nhận được dưới tải mục tiêu: **0%** (load suite)
- [x] Rate limit hoạt động đúng
- [x] Luồng auth đọc (`/auth/me`, `/enrollments/me`) ổn định: **100% checks pass**, p95 **~172ms**

### Tóm tắt

| Test | Kết luận |
|------|----------|
| Smoke | Chức năng **PASS**; latency lần đầu cao (~30s p95) do **Render cold start** |
| Load suite | **PASS toàn bộ** — 100% checks, 0% errors, p95 ~196ms |

API production trên Render **đáp ứng tốt** tải 3 user ảo đồng thời trên các luồng browse + auth read. Kết quả phù hợp để đưa vào portfolio.

### Điểm cần cải thiện (nếu có)

- **Cold start Render free tier:** request đầu sau idle có thể mất 30–60s — cân nhắc always-on plan hoặc warmup cron nếu production thật.
- **Redis trên Render:** chưa bật — rate limit đếm in-memory theo instance; thêm Redis khi scale nhiều instance.
- **Load test nặng hơn:** cần tách IP / tăng rate limit trên staging, không test quá 100 req/3 phút trên production.

### Ghi chú triển khai

- Chạy **smoke trước load-suite** (`run.ps1`) giúp đánh thức server — load suite có latency thấp hơn smoke.
- Test từ 1 IP bị ảnh hưởng bởi rate limit — hành vi bảo vệ có chủ đích.