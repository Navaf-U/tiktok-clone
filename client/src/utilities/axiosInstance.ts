import userManager from "@/components/shared/userManager";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isLoggingOut = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401) {
      if (isLoggingOut) {
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refreshToken`,
            {},
            { withCredentials: true }
          );
          const newAccessToken = response.data.token;
          localStorage.setItem("token", newAccessToken);
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (err) {
          console.error("Refresh token failed, logging out user...",err);
        }
      }

      isLoggingOut = true;
      await userManager.clearUser();
      isLoggingOut = false;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
