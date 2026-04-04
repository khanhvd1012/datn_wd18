import api from "./api";

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
