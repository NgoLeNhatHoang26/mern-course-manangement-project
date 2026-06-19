process.env.NODE_ENV = 'test';

// JWT cho auth.service / auth.middleware
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES = '15m';

// Tắt Redis để rate-limit dùng memory store
delete process.env.REDIS_URL;

// Có thể thêm nếu code bạn cần
process.env.PORT = '5001';