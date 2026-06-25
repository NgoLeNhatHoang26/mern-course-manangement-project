/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Kiểm tra trạng thái server và dependency
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: >
 *       Kiểm tra server và các dependency chính (MongoDB, Redis).
 *       Trả `200` khi tất cả OK; `503` khi ít nhất một dependency bị lỗi.
 *       **Lưu ý:** endpoint nằm ở root (`http://localhost:5000/health`), không có prefix `/api`.
 *     tags: [Health]
 *     servers:
 *       - url: http://localhost:5000
 *         description: Root server
 *     responses:
 *       200:
 *         description: Server và mọi dependency đang hoạt động
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthReport'
 *             example:
 *               success: true
 *               data:
 *                 status: UP
 *                 timestamp: "2026-06-25T00:00:00.000Z"
 *                 uptime: 3600
 *                 dependencies:
 *                   mongodb:
 *                     status: UP
 *                     latencyMs: 2
 *                   redis:
 *                     status: UP
 *                     latencyMs: 1
 *       503:
 *         description: Một hoặc nhiều dependency không sẵn sàng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthReport'
 *             example:
 *               success: true
 *               data:
 *                 status: DEGRADED
 *                 timestamp: "2026-06-25T00:00:00.000Z"
 *                 uptime: 120
 *                 dependencies:
 *                   mongodb:
 *                     status: DOWN
 *                     message: "Not connected"
 *                   redis:
 *                     status: DISABLED
 *                     message: "REDIS_URL not configured"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DependencyCheck:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [UP, DOWN, DISABLED]
 *           description: UP = kết nối tốt; DOWN = lỗi; DISABLED = không cấu hình
 *         message:
 *           type: string
 *           description: Mô tả lỗi (chỉ có khi DOWN hoặc DISABLED)
 *         latencyMs:
 *           type: number
 *           description: Độ trễ ping tính bằng ms (chỉ có khi UP)
 *     HealthReport:
 *       type: object
 *       required:
 *         - status
 *         - timestamp
 *         - uptime
 *         - dependencies
 *       properties:
 *         status:
 *           type: string
 *           enum: [UP, DEGRADED]
 *         timestamp:
 *           type: string
 *           format: date-time
 *         uptime:
 *           type: number
 *           description: Số giây server đã chạy
 *         dependencies:
 *           type: object
 *           properties:
 *             mongodb:
 *               $ref: '#/components/schemas/DependencyCheck'
 *             redis:
 *               $ref: '#/components/schemas/DependencyCheck'
 */
