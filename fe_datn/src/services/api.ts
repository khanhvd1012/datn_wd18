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
    config.headers =
      config.headers || ({} as import("axios").AxiosRequestHeaders);
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
    return Promise.reject(error);
  },
);

export default api;
