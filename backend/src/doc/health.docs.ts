/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Kiểm tra trạng thái server
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: >
 *       Kiểm tra server có đang chạy không.
 *       **Lưu ý:** endpoint này nằm ở root (`http://localhost:5000/health`),
 *       không có prefix `/api`.
 *     tags: [Health]
 *     servers:
 *       - url: http://localhost:5000
 *         description: Root server
 *     responses:
 *       200:
 *         description: Server đang hoạt động
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Số giây server đã chạy
 *                   example: 3600
 */
