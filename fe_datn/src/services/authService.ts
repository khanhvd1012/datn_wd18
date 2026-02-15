import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const registerApi = async (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};
