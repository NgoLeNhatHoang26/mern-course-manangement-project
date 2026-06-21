/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Quản lý bài học — nested dưới chương (module)
 */

/**
 * @swagger
 * /courses/{courseId}/modules/{moduleId}/lessons:
 *   get:
 *     summary: Lấy danh sách bài học của chương
 *     description: Public endpoint. Trả về tất cả bài học trong chương, sắp xếp theo `order`.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012345
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012346
 *     responses:
 *       200:
 *         description: Danh sách bài học
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
 *                         $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Không tìm thấy chương
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   post:
 *     summary: Tạo bài học mới (Admin only)
 *     description: >
 *       Upload video lên Cloudinary qua `multipart/form-data`.
 *       Field `videoUrl` là file video; sau khi upload, URL Cloudinary sẽ được lưu.
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012345
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012346
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, duration, order]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Bài 1 - Hello World"
 *               content:
 *                 type: string
 *                 example: Nội dung bài học
 *               duration:
 *                 type: number
 *                 description: Thời lượng bài học (phút)
 *                 example: 30
 *               order:
 *                 type: number
 *                 example: 1
 *               isPreview:
 *                 type: boolean
 *                 description: Cho phép xem trước khi chưa đăng ký
 *                 example: false
 *               videoUrl:
 *                 type: string
 *                 format: binary
 *                 description: File video (upload lên Cloudinary)
 *     responses:
 *       201:
 *         description: Tạo bài học thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lesson'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       403:
 *         description: Không có quyền Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */

/**
 * @swagger
 * /lessons/{lessonId}:
 *   get:
 *     summary: Lấy chi tiết bài học
 *     description: Public endpoint. Trả về thông tin đầy đủ của bài học.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012347
 *     responses:
 *       200:
 *         description: Chi tiết bài học
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Không tìm thấy bài học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   patch:
 *     summary: Cập nhật bài học (Admin only)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012347
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               duration:
 *                 type: number
 *               order:
 *                 type: number
 *               isPreview:
 *                 type: boolean
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
 *                       $ref: '#/components/schemas/Lesson'
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       403:
 *         description: Không có quyền Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Không tìm thấy bài học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   delete:
 *     summary: Xóa bài học (Admin only)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012347
 *     responses:
 *       200:
 *         description: Xóa thành công
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
 *       401:
 *         description: Chưa đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       403:
 *         description: Không có quyền Admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       404:
 *         description: Không tìm thấy bài học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
