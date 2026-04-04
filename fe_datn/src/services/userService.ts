import api from "./api";

export const getAllUsersApi = async () => {
  const res = await api.get('/users');
  return res.data;
};

export const updateUserRoleApi = async (id: string, role: string) => {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data;
};

export const deleteUserApi = async (id: string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

// Lấy danh sách ID sản phẩm yêu thích (Trả về cả object tuỳ BE nhưng ta cần ID)
export const getFavoritesApi = async () => {
  const response = await api.get("/users/favorites");
  return response.data.data; // trả về mảng các object hoặc ID
};

// Toggle (Thêm hoặc Bỏ yêu thích) một sản phẩm
export const toggleFavoriteApi = async (productId: string) => {
  const response = await api.post("/users/favorites", { productId });
  return response.data;
};
