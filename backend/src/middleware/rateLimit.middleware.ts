import rateLimit from "express-rate-limit";

export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // giới hạn mỗi IP chỉ được gửi tối đa 100 request trong 15 phút
    message: "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút",
    standardHeaders: true, // gửi thông tin rate limit trong header `RateLimit-*`
    legacyHeaders: false, // không gửi header `X-RateLimit-*`
});

export const authRateLimiter = rateLimit({
    windowMs:  30 * 60 * 1000, // 30 phút
    max: 10, // giới hạn mỗi IP chỉ được gửi tối đa 10 request trong 30 phút
    message: "Quá nhiều yêu cầu đăng nhập từ IP này, vui lòng thử lại sau 30 phút",
    standardHeaders: true,
    legacyHeaders: false,
});