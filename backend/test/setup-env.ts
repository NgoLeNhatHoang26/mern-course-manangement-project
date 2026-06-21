process.env.NODE_ENV = 'test';

process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES = '15m';

delete process.env.REDIS_URL;

process.env.PORT = '5001';