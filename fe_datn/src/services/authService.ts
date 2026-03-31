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

// UPDATE ME
export const updateMeAPI = async (data: any) => {
  const res = await api.patch("/auth/me/update", data);
  return res.data;
};

// CHANGE PASSWORD
export const changePasswordAPI = async (data: any) => {
  const res = await api.put("/auth/me/change-password", data);
  return res.data;
};