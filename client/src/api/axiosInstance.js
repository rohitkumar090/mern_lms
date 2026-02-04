import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://mern-lms-htxr.onrender.com",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
