import api from "./api";

export const getAllProductsApi = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createProductApi = async (data: FormData) => {
  const res = await api.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProductApi = async (id: string, data: FormData) => {
  const res = await api.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProductApi = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};