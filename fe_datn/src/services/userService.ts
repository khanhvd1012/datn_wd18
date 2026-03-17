import api from './api';

export const getAllUsersApi = async () => {
  const res = await api.get('/users');
  return res.data.data || [];
};

export const updateUserRoleApi = async (userId: string, role: string) => {
  const res = await api.patch(`/users/${userId}/role`, { role });
  return res.data.user;
};

export const deleteUserApi = async (userId: string) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};
