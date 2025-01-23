import { UserContext } from "@/context/UserProvider";
import axios from "axios";
import { useContext } from "react";
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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refreshToken`,
          {},
          {
            withCredentials: true,  
          }
        );
        const newAccessToken = response.data.token;
        localStorage.setItem("token", newAccessToken); 
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        const userContext = useContext(UserContext);
        const { setCurrUser } = userContext || {};
        localStorage.removeItem("token");
        if (setCurrUser) {
          setCurrUser(null);
        }
        localStorage.removeItem("currUser");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
