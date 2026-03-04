import api from "./api";

export const getAllBannersApi = async () => {
  const res = await api.get("/banners");
  return res.data;
};

export const createBannerApi = async (data: FormData) => {
  const res = await api.post("/banners", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteBannerApi = async (id: string) => {
  const res = await api.delete(`/banners/${id}`);
  return res.data;
};

export const toggleBannerStatusApi = async (id: string) => {
  const res = await api.put(`/banners/${id}/toggle-status`);
  return res.data;
};