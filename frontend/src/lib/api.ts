/// <reference types="vite/client" />

import axios from "axios";
import { getAuthToken, setAuthToken, clearAuthToken } from '@features/auth/constants';
import { ROUTES } from '../constants/routes';

let isRefreshing = false
let failedQueue: any[] = [];
const envApiUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = envApiUrl || '/api';
const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
});

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if(error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

const isWrappedResponse = (payload: unknown): payload is { success: boolean; data: unknown } => {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    'data' in payload &&
    typeof (payload as { success: unknown }).success === 'boolean'
  );
};


axiosClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Xử lý trường hợp nhiều request bị lỗi 401 cùng lúc trong khi đang refresh access token
axiosClient.interceptors.response.use(
    (response) => {
        if (isWrappedResponse(response.data)) {
            response.data = response.data.data;
        }
        return response;
    },
    async (error) => {
        const isAuthMe = error.config?.url?.includes("/auth/me");
        const originalRequest = error.config
        const isRefreshUrl = originalRequest?.url?.includes("/auth/refresh");


        if (error.response?.status === 401 && originalRequest && !isAuthMe && !isRefreshUrl && !originalRequest._retry) {

            if (isRefreshing){
                // Đang refresh → không gọi thêm, đưa vào hàng chờ
                // Khi refresh xong, processQueue sẽ retry các request này
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject})
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return axiosClient(originalRequest)
                })
            }
            originalRequest._retry = true // Tránh gọi refresh lần 2

            isRefreshing = true

            try {
                // Browser tự gửi refreshToken cookie nhờ withCredentials: true
                const res = await axiosClient.post('/auth/refresh')
                const newToken = res.data?.accessToken
                if (!newToken) {
                    throw new Error('Missing access token in refresh response')
                }

                setAuthToken(newToken)
                processQueue(null, newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
                return axiosClient(originalRequest)
            } catch {
                // Refresh thất bại → refreshToken hết hạn hoặc không hợp lệ
                // Bắt buộc phải login lại
                processQueue(new Error('Refresh failed'), null)
                clearAuthToken()
                window.location.href = ROUTES.SIGNIN
                return Promise.reject(error)
            } finally {
                isRefreshing = false
            }
        }
        return Promise.reject(error);
    }
);
export default axiosClient;