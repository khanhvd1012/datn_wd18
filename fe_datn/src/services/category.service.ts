import API from "./api";

export const categoryService = {
  getAll: async () => {
    const res = await API.get("/categories");
    return res.data;
  },
};