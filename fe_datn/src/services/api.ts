import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers = config.headers || ({} as import("axios").AxiosRequestHeaders);
    // Luôn gộp Authorization vào headers có sẵn (tránh mất token khi gửi FormData)
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  // Ensure we don't send empty bodies for GET requests
  if (config.method === "get" && config.data) {
    delete config.data;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.status === 400 && error.response?.data?.message) {
      console.error("Bad Request:", error.response.data.message);
    }
    // Token hết hạn hoặc không hợp lệ → chỉ xóa user + redirect khi ở trang admin
    if (error.response?.status === 401) {
      const msg = error.response?.data?.message || "";
      if (msg.includes("Token") || msg.includes("đăng nhập")) {
        // Chỉ clear user + redirect trên trang admin (trang client giữ nguyên, component tự xử lý)
        if (window.location.pathname.startsWith("/admin")) {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
