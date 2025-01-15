import axios from "axios";
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
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:3000/auth/refreshToken",
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
        localStorage.removeItem("token");
        localStorage.removeItem("currUser");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
