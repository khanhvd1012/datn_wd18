import api from "./api";

// lấy tất cả category
export const getAllCategoriesApi = async () => {
  const res = await api.get("/categories");
  return res.data;
};

// tạo category
export const createCategoryApi = async (data: FormData) => {
  const res = await api.post("/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// update
export const updateCategoryApi = async (id: string, data: FormData) => {
  const res = await api.put(`/categories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// delete
export const deleteCategoryApi = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};