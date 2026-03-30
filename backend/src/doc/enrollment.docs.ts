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
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Đã đăng ký khoá học này rồi
 *   get:
 *     summary: Lấy danh sách khoá học đã đăng ký
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách enrollment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Enrollment'
 */