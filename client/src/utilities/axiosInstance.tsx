import { toast } from "@/hooks/use-toast";
import axios from "axios";
import Cookies from "js-cookie";
import axiosErrorManager from "./axiosErrorManager";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000" as string,
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.token;

        Cookies.set("token", newAccessToken, {
          secure: true,
          sameSite: "None",
        });

        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Error refreshing token:", err);
        toast({
          title: "Error",
          description: axiosErrorManager(err) || "An unknown error occurred.",
          className: "bg-red-500 font-semibold text-white",
        })
        Cookies.remove("token");
        Cookies.remove("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    console.error("Request failed:", axiosErrorManager(error));
    return Promise.reject(error);
  }
);

export default axiosInstance;
