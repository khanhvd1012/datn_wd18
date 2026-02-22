import API from "./api";

export const registerApi = async (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};
