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
// FORGOT PASSWORD
export const forgotPasswordAPI = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

// RESET PASSWORD
export const resetPasswordAPI = async (token: string, password: string) => {
  const res = await api.post(`/auth/reset-password/${token}`, {
    password,
  });
  return res.data;
};