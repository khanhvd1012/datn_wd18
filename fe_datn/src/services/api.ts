import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // Đọc token từ localStorage["token"] — đây là nơi loginAPI lưu token
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || ({} as import("axios").AxiosRequestHeaders);
    config.headers.Authorization = `Bearer ${token}`;
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
    if (error.response) {
      // Log full response body to help debugging validation errors
      console.error("API Response data:", error.response.data);
      if (error.response?.status === 400) {
        const data = error.response.data;
        if (data?.message) {
          console.error("Bad Request:", data.message);
        } else if (data?.messages) {
          console.error("Bad Request (messages):", data.messages);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
