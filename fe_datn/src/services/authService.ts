import api from "./api";

// REGISTER
export const registerAPI = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginAPI = async (data: any) => {
  const res = await api.post("/auth/login", data);

  localStorage.setItem("token", res.data.accessToken);

  return res.data;
};

// GET ME
export const getMeAPI = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};