/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Quản lý bài học
 */

/**
 * @swagger
 * /modules/{moduleId}/lessons:
 *   get:
 *     summary: Lấy danh sách bài học của chương
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách bài học
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lesson'
 *   post:
 *     summary: Tạo bài học mới (Admin only)
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, content, duration]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Bài 1 - Hello World
 *               content:
 *                 type: string
 *                 example: Nội dung bài học
 *               duration:
 *                 type: number
 *                 example: 30
 *               isPreview:
 *                 type: boolean
 *                 example: false
 *               videoUrl:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       403:
 *         description: Không có quyền
 */

/**
 * @swagger
 * /lessons/{lessonId}:
 *   get:
 *     summary: Lấy chi tiết bài học
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chi tiết bài học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Lesson'
 *       404:
 *         description: Không tìm thấy bài học
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
 *               isPreview:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy bài học
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
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy bài học
 */