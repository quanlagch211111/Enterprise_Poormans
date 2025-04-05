import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn
      const shouldExtend = toast.info(
        "Your session has expired. Would you like to extend it?"
      );

      if (shouldExtend) {
        try {
          const refreshResponse = await axios.post(
            "users/token",
            {},
            { withCredentials: true }
          );
          if (refreshResponse.status === 200) {
            localStorage.setItem(
              "accessToken",
              refreshResponse.data.accessToken
            );
            toast.success("Session extended successfully!");
            return instance.request(error.config); // Retry the original request
          }
        } catch (refreshError) {
          toast.error("Failed to extend session. Please log in again.");
          localStorage.clear();
          window.location.href = "/login"; // Redirect to login page
        }
      } else {
        // Người dùng chọn đăng xuất
        localStorage.clear();
        window.location.href = "/login"; // Redirect to login page
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
