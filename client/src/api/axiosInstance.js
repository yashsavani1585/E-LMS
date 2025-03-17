import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL , // Use Vite's env variable
  withCredentials: true, // Send cookies with requests
});

axiosInstance.interceptors.request.use(
    (config) => {
      try {
        const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error("Error retrieving accessToken from sessionStorage", error);
      }
      
      return config;
    },
    (err) => Promise.reject(err)
);

export default axiosInstance;
