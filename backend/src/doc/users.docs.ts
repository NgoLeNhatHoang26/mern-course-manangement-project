/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý hồ sơ người dùng
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy hồ sơ user hiện tại
 *     description: Trả về thông tin profile của user đang đăng nhập (không bao gồm password).
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hồ sơ user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   patch:
 *     summary: Cập nhật hồ sơ user hiện tại
 *     description: Chỉ cho phép cập nhật `userName` và `avatar`. Các field khác bị bỏ qua để tránh mass assignment.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 minLength: 2
 *                 example: NhatHoang
 *               avatar:
 *                 type: string
 *                 description: URL ảnh avatar
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   post:
 *     summary: Tạo tài khoản mới (public, không qua auth route)
 *     description: >
 *       Endpoint thay thế cho `/auth/register` — tạo tài khoản và trả về access token ngay lập tức.
 *       Không cần đăng nhập.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, email, password]
 *             properties:
 *               userName:
 *                 type: string
 *                 minLength: 2
 *                 example: NhatHoang
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hoang@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công, trả về token
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: User created successfully
 *                         token:
 *                           type: string
 *                           description: Access token JWT (7 ngày)
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: Thiếu field hoặc password quá ngắn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /users/enrollments:
 *   get:
 *     summary: Lấy danh sách khoá học đã đăng ký (nested route)
 *     description: Alias của `GET /enrollments/me`, gắn dưới `/users/enrollments`.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách enrollment
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
