import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const loginApi = (data: LoginPayload) => {
  return axiosInstance.post("/auth/login", data);
};

export const registerApi = (data: RegisterPayload) => {
  return axiosInstance.post("/auth/register", data);
};