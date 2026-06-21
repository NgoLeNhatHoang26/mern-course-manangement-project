/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Quản lý đăng ký khoá học
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Đăng ký khoá học
 *     description: Đăng ký user hiện tại vào khoá học. Mỗi user chỉ được đăng ký mỗi khoá một lần.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 665abc123def456789012345
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
 *                       $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Đã đăng ký khoá học này rồi (unique constraint)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /enrollments/me:
 *   get:
 *     summary: Lấy danh sách khoá học đã đăng ký của user hiện tại
 *     description: Trả về tất cả enrollment của user đang đăng nhập, sắp xếp theo `enrollmentAt` mới nhất.
 *     tags: [Enrollments]
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

/**
 * @swagger
 * /enrollments/{courseId}/check:
 *   get:
 *     summary: Kiểm tra user đã đăng ký khoá học chưa
 *     description: Trả về trạng thái enrollment của user hiện tại cho khoá học cụ thể.
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID khoá học cần kiểm tra
 *         example: 665abc123def456789012345
 *     responses:
 *       200:
 *         description: Kết quả kiểm tra
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
 *                         isEnrolled:
 *                           type: boolean
 *                           example: true
 *                         enrollment:
 *                           nullable: true
 *                           allOf:
 *                             - $ref: '#/components/schemas/Enrollment'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
