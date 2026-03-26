import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// api.js — thêm response interceptor
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthMe = error.config?.url?.includes("/auth/me");

        if (error.response?.status === 401 && !isAuthMe) {
            localStorage.removeItem("token");
            window.location.href = "/signin";
        }
        return Promise.reject(error);
    }
);
export default axiosClient;