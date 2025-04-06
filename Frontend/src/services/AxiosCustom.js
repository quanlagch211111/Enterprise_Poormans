import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // Gửi cookie cho tất cả request
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      toast.info("Session expired. Trying to extend...");

      try {
        const refreshResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/users/token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.status === 200) {
          const newAccessToken = refreshResponse.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          toast.success("Session extended successfully!");

          // Gắn accessToken mới vào header trước khi retry
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;

          return instance.request(error.config);
        }
      } catch (refreshError) {
        toast.error("Failed to extend session. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
