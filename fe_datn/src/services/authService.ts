import api from "./api";

// REGISTER
export const registerAPI = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const loginAPI = async (data: any) => {
  const res = await api.post("/auth/login", data);

  const userData = {
    _id: res.data.user._id,
    email: res.data.user.email,
    username: res.data.user.username,
    role: res.data.user.role,
    avatar: res.data.user.avatar,
    token: res.data.accessToken,
  };
  localStorage.setItem("user", JSON.stringify(userData));

  return res.data;
};

// GET ME
export const getMeAPI = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};