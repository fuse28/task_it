import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// ✅ Request Interceptor — attach access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response Interceptor — handle expired tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired (401) and not retried yet
    if (
      (error.response?.status === 401 && !originalRequest._retry) ||
      (localStorage.getItem("refreshToken") &&
        localStorage.getItem("accessToken") === undefined) ||
      null
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token found");

        // Request new tokens
        const { data } = await axios.post(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
          }/auth/refresh`,
          { refreshToken }
        );

        // Save new tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Retry the failed request with new access token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return API(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        console.log(window.location.href);
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
