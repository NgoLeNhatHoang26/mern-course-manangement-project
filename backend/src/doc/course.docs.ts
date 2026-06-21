/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Quản lý khoá học
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lấy danh sách khoá học
 *     description: >
 *       Public endpoint. Hỗ trợ tìm kiếm theo tên (`search`) và lọc theo cấp độ (`level`).
 *       Kết quả được cache Redis để tăng hiệu suất.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên khoá học (không phân biệt hoa thường)
 *         example: JavaScript
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [Cơ bản, Trung bình, Nâng cao]
 *         description: Lọc theo cấp độ
 *     responses:
 *       200:
 *         description: Danh sách khoá học
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
 *                         $ref: '#/components/schemas/Course'
 *   post:
 *     summary: Tạo khoá học mới (Admin only)
 *     description: >
 *       Tạo khoá học với thumbnail upload lên Cloudinary.
 *       Request phải dùng `multipart/form-data`.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, description, level, instructor]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Khoá học React từ cơ bản đến nâng cao
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 example: Học React, hooks, context, Redux Toolkit...
 *               level:
 *                 type: string
 *                 enum: [Cơ bản, Trung bình, Nâng cao]
 *               instructor:
 *                 type: string
 *                 minLength: 2
 *                 example: Nguyen Van A
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Ảnh thumbnail (jpg/png, upload lên Cloudinary)
 *     responses:
 *       201:
 *         description: Tạo khoá học thành công
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Course'
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
 * /courses/{courseId}:
 *   get:
 *     summary: Lấy chi tiết khoá học
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012345
 *     responses:
 *       200:
 *         description: Chi tiết khoá học
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiSuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Course'
 *       404:
 *         description: Không tìm thấy khoá học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   put:
 *     summary: Cập nhật khoá học (Admin only)
 *     description: Có thể cập nhật một phần (partial). Nếu có thumbnail mới, upload lên Cloudinary.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012345
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Cơ bản, Trung bình, Nâng cao]
 *               instructor:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
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
 *                       $ref: '#/components/schemas/Course'
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
 *         description: Không tìm thấy khoá học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *   delete:
 *     summary: Xóa khoá học (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         example: 665abc123def456789012345
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
 *                           example: Xóa khoá học thành công
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
 *         description: Không tìm thấy khoá học
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
