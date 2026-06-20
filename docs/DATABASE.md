# Database Schema

MongoDB database tên `course-management`, gồm 6 collections.

---

## 1. ER Diagram

```
┌──────────────────┐         ┌─────────────────────┐
│      users       │         │       courses        │
│──────────────────│         │─────────────────────│
│ _id              │         │ _id                  │
│ userName         │         │ title                │
│ email (unique)   │         │ description          │
│ password         │         │ level                │
│ role             │         │ instructor           │
│ avatarUrl        │         │ thumbnail            │
│ bio              │         │ studentCount  ◄──┐  │
│ isActive         │         │ ratingAverage ◄──┼─┐│
│ refreshToken     │         │ ratingCount   ◄──┼─┘│
│ resetPwdToken    │         │ createdAt        │   │
│ resetPwdExpires  │         │ updatedAt        │   │
│ createdAt        │         └──────┬───────────┘   │
│ updatedAt        │                │ 1             │
└────────┬─────────┘                │               │
         │ 1                  ┌─────┴──────────┐    │
         │                    │  lessonModules │    │
         │               ┌────│────────────────│    │
         │               │    │ _id            │    │
         │               │    │ courseId (ref) │    │
         │               │    │ title          │    │
         │               │    │ description    │    │
         │               │    │ order          │    │
         │               │    │ createdAt      │    │
         │               │    │ updatedAt      │    │
         │               │    └────────┬───────┘    │
         │               │             │ 1          │
         │               │    ┌────────┴───────┐    │
         │               │    │    lessons     │    │
         │               │    │────────────────│    │
         │               │    │ _id            │    │
         │               │    │ courseId (ref) │    │
         │               │    │ moduleId (ref) │    │
         │               │    │ title          │    │
         │               │    │ content        │    │
         │               │    │ videoUrl       │    │
         │               │    │ duration       │    │
         │               │    │ order          │    │
         │               │    │ isPreview      │    │
         │               │    │ createdAt      │    │
         │               │    │ updatedAt      │    │
         │               │    └────────────────┘    │
         │ n                                         │
┌────────┴──────────┐    n                    n     │
│    enrollments    │◄────────────────────────┘     │
│───────────────────│                               │
│ _id               │    auto-update studentCount ──┘
│ userId    (ref)   │
│ courseId  (ref)   │
│ progress          │
│ completedLessons  │
│ enrollmentAt      │
│ createdAt         │
│ updatedAt         │
└───────────────────┘

         │ 1 (user)
         │ n
┌────────┴──────────┐
│      reviews      │    n
│───────────────────│◄────────── courses (1)
│ _id               │
│ userId    (ref)   │    auto-update ratingAverage, ratingCount
│ courseId  (ref)   │
│ rating            │
│ comment           │
│ createdAt         │
│ updatedAt         │
└───────────────────┘
```

### Quan hệ tóm tắt

```
User      1 ──── n   Enrollment   n ──── 1   Course
User      1 ──── n   Review       n ──── 1   Course
Course    1 ──── n   LessonModule 1 ──── n   Lesson
```

---

## 2. Collections

### 2.1 `users`

| Field | Type | Ràng buộc | Mô tả |
|-------|------|-----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `userName` | String | required | Tên hiển thị |
| `email` | String | required, unique | Email đăng nhập |
| `password` | String | required, `select: false` | Bcrypt hash, ẩn mặc định |
| `role` | String | default: `'user'` | `'user'` hoặc `'admin'` |
| `avatarUrl` | String | optional | URL ảnh đại diện |
| `bio` | String | optional | Giới thiệu ngắn |
| `isActive` | Boolean | default: `true` | Admin có thể khóa tài khoản |
| `refreshToken` | String | optional, `select: false` | JWT refresh token (7 ngày) |
| `resetPasswordToken` | String | optional, `select: false` | SHA-256 hash của raw token |
| `resetPasswordExpires` | Date | optional, `select: false` | Hết hạn sau 15 phút |
| `createdAt` | Date | auto (timestamps) | |
| `updatedAt` | Date | auto (timestamps) | |

**Indexes:**

```js
{ email: 1 }                                          // unique
{ refreshToken: 1 }                                   // unique, partial (refreshToken exists & not empty)
{ resetPasswordToken: 1, resetPasswordExpires: 1 }    // partial (resetPasswordToken exists)
```

---

### 2.2 `courses`

| Field | Type | Ràng buộc | Mô tả |
|-------|------|-----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `title` | String | required | Tên khoá học |
| `description` | String | required | Mô tả chi tiết |
| `level` | String | required, enum | `'Cơ bản'` / `'Trung bình'` / `'Nâng cao'` |
| `instructor` | String | required | Tên giảng viên |
| `thumbnail` | String | default: `/images/default_thumbnail.png` | URL ảnh (Cloudinary) |
| `studentCount` | Number | default: `0` | Cập nhật tự động qua Enrollment hook |
| `ratingAverage` | Number | default: `0` | Cập nhật tự động qua Review hook |
| `ratingCount` | Number | default: `0` | Cập nhật tự động qua Review hook |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes:**

```js
{ level: 1, title: 1 }    // compound — tăng tốc lọc theo level + sort theo title
```

**Redis cache:**

- Key `courses:all` — danh sách toàn bộ (invalidate khi create/update/delete)
- Key `courses:search:<query>` — kết quả tìm kiếm

---

### 2.3 `lessonmodules`

| Field | Type | Ràng buộc | Mô tả |
|-------|------|-----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `courseId` | ObjectId | ref: `Course` | Khoá học sở hữu |
| `title` | String | required | Tên chương |
| `description` | String | required | Mô tả chương |
| `order` | Number | required | Thứ tự hiển thị trong khoá học |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes:**

```js
{ courseId: 1, order: 1 }    // compound — lấy chương theo course, sort theo order
```

---

### 2.4 `lessons`

| Field | Type | Ràng buộc | Mô tả |
|-------|------|-----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `courseId` | ObjectId | ref: `Course` | Khoá học sở hữu |
| `moduleId` | ObjectId | ref: `LessonModule` | Chương sở hữu |
| `title` | String | required | Tên bài học |
| `content` | String | required | Nội dung / mô tả bài học |
| `videoUrl` | String | optional | URL video (Cloudinary) |
| `duration` | Number | required | Thời lượng (phút) |
| `order` | Number | required | Thứ tự trong chương |
| `isPreview` | Boolean | default: `false` | Xem trước miễn phí khi chưa đăng ký |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes:**

```js
{ moduleId: 1, order: 1 }    // compound — lấy bài theo module, sort theo order
```

---

### 2.5 `enrollments`

| Field | Type | Ràng buộc | Mô tả |
|-------|------|-----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId | ref: `User`, required | User đăng ký |
| `courseId` | ObjectId | ref: `Course`, required | Khoá học |
| `progress` | Number | default: `0` | Tiến độ học (%) |
| `completedLessons` | Number | default: `0` | Số bài đã hoàn thành |
| `enrollmentAt` | Date | default: `Date.now` | Thời điểm đăng ký |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes:**

```js
{ userId: 1, courseId: 1 }       // unique — mỗi user chỉ đăng ký mỗi khoá một lần
{ userId: 1, enrollmentAt: -1 }  // lấy danh sách enrollment của user, mới nhất trước
```

**Mongoose Hooks:**

```js
// post('save') — sau khi tạo enrollment mới
Course.findByIdAndUpdate(courseId, { $inc: { studentCount: 1 } })

// post('findOneAndDelete') — sau khi hủy enrollment
Course.findByIdAndUpdate(courseId, { $inc: { studentCount: -1 } })
```

---

### 2.6 `reviews`

| Field | Type | Ràng buộc | Mô tả |
|-------|------|-----------|-------|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId | ref: `User`, required | Tác giả đánh giá |
| `courseId` | ObjectId | ref: `Course`, required | Khoá học được đánh giá |
| `rating` | Number | required, 1–5, integer | Điểm đánh giá |
| `comment` | String | required | Nhận xét |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

**Indexes:**

```js
{ userId: 1, courseId: 1 }    // unique — mỗi user chỉ đánh giá mỗi khoá một lần
{ courseId: 1, createdAt: -1 } // lấy reviews theo course, mới nhất trước
```

**Mongoose Hooks (static `calcAverageRating`):**

```js
// Được gọi sau post('save') và post('findOneAndDelete')
Review.aggregate([
    { $match: { courseId } },
    { $group: { _id: '$courseId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
])
// → Course.findByIdAndUpdate({ ratingAverage: round(avg, 1), ratingCount: count })
// Nếu không còn review nào → ratingAverage: 0, ratingCount: 0
```

---

## 3. Tổng hợp Indexes

| Collection | Index | Loại | Mục đích |
|------------|-------|------|----------|
| `users` | `email` | unique | Đảm bảo email không trùng, tăng tốc lookup login |
| `users` | `refreshToken` | unique, partial | Tìm user khi refresh / logout token |
| `users` | `resetPasswordToken + resetPasswordExpires` | partial | Tìm user khi reset password |
| `courses` | `level + title` | compound | Lọc theo level + sort theo tên |
| `lessonmodules` | `courseId + order` | compound | Lấy chương theo course, sắp xếp đúng thứ tự |
| `lessons` | `moduleId + order` | compound | Lấy bài theo chương, sắp xếp đúng thứ tự |
| `enrollments` | `userId + courseId` | unique, compound | Ngăn đăng ký trùng |
| `enrollments` | `userId + enrollmentAt` | compound | Lấy lịch sử đăng ký của user |
| `reviews` | `userId + courseId` | unique, compound | Ngăn đánh giá trùng |
| `reviews` | `courseId + createdAt` | compound | Lấy reviews theo course, mới nhất trước |

---

## 4. Luồng dữ liệu quan trọng

### Tạo Review → Cập nhật Rating

```
POST /api/courses/:id/reviews
    │
    ▼
Review.save()
    │
    ▼ (post save hook tự động)
Review.calcAverageRating(courseId)
    │  aggregate: avg(rating), count
    ▼
Course.findByIdAndUpdate({
    ratingAverage: <trung bình làm tròn 1 chữ số>,
    ratingCount:   <số lượng>
})
```

### Đăng ký Khoá học → Cập nhật Student Count

```
POST /api/enrollments
    │
    ▼
Enrollment.save()
    │
    ▼ (post save hook tự động)
Course.findByIdAndUpdate({
    $inc: { studentCount: 1 }
})
```

### Hủy Enrollment → Giảm Student Count

```
DELETE enrollment (findOneAndDelete)
    │
    ▼ (post findOneAndDelete hook tự động)
Course.findByIdAndUpdate({
    $inc: { studentCount: -1 }
})
```
