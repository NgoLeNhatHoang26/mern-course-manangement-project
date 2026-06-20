/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực người dùng — JWT access token + HttpOnly refresh cookie
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     description: >
 *       Tạo tài khoản. Sau khi thành công, dùng `POST /auth/login` để đăng nhập.
 *       `confirmPassword` phải khớp với `password`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userName, email, password, confirmPassword]
 *             properties:
 *               userName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: NhatHoang
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hoang@gmail.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               confirmPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
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
 *                           example: Register successfully
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc confirmPassword không khớp
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
 *       429:
 *         description: Quá nhiều yêu cầu — rate limit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     description: >
 *       Trả về `token` (access token JWT, 15 phút) trong body.
 *       Đồng thời set cookie `refreshToken` (HttpOnly, 7 ngày) trong response — cookie này
 *       được dùng tự động bởi trình duyệt khi gọi `POST /auth/refresh`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hoang@gmail.com
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công. Cookie `refreshToken` được set tự động.
 *         headers:
 *           Set-Cookie:
 *             description: HttpOnly cookie refreshToken (7 ngày)
 *             schema:
 *               type: string
 *               example: refreshToken=eyJ...; HttpOnly; SameSite=Strict; Max-Age=604800
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Email hoặc password không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       429:
 *         description: Quá nhiều yêu cầu — rate limit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     description: Trả về thông tin user đang đăng nhập dựa trên access token.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin user
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/AuthUser'
 *       401:
 *         description: Access token không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Lấy access token mới bằng refresh token
 *     description: >
 *       Đọc cookie `refreshToken` (HttpOnly) và phát hành access token mới (15 phút).
 *       Không cần request body. Client cần gửi request với `credentials: "include"`.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Access token mới
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
 *                         accessToken:
 *                           type: string
 *                           description: Access token JWT mới (15 phút)
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token không hợp lệ, hết hạn hoặc không tìm thấy trong cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     description: >
 *       Xoá `refreshToken` trong database và clear cookie `refreshToken` trên client.
 *       Nếu không có cookie, vẫn trả về 200 (idempotent).
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
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
 *                           example: Logged out successfully
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Yêu cầu reset password
 *     description: >
 *       Gửi email chứa link reset password (token hợp lệ trong 15 phút).
 *       Luôn trả về cùng message dù email tồn tại hay không (tránh user enumeration).
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hoang@gmail.com
 *     responses:
 *       200:
 *         description: Yêu cầu đã được xử lý (message luôn giống nhau)
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
 *                           example: Nếu email tồn tại, bạn sẽ nhận được link reset
 *       400:
 *         description: Email không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Đặt lại password
 *     description: >
 *       Dùng token từ email reset password để đặt lại password mới.
 *       Token chỉ hợp lệ trong 15 phút kể từ khi gửi email.
 *       `confirmPassword` phải khớp với `password`.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password, confirmPassword]
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token nhận được qua email
 *                 example: a1b2c3d4e5f6...
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *               confirmPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đặt lại password thành công
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
 *                           example: Đặt lại mật khẩu thành công
 *       400:
 *         description: Token không hợp lệ, hết hạn, hoặc password không khớp
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
