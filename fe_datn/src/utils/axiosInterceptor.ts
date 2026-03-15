import axios from "axios";

// Tạo axios instance với interceptor để xử lý token hết hạn
const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Request interceptor - thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi token hết hạn
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";
      
      // Nếu token hết hạn hoặc không hợp lệ
      if (errorMessage.includes("hết hạn") || errorMessage.includes("không hợp lệ")) {
        // Xóa token và user khỏi localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Chuyển đến trang login
        if (window.location.pathname !== "/login") {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
