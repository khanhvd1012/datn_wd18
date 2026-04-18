import api from "./api";

export const createReviewApi = async (data: { productId: string; rating: number; comment: string; orderId: string }) => {
  const res = await api.post("/reviews", data);
  return res.data;
};

export const getAllReviewsApi = async () => {
  const res = await api.get("/reviews");
  return res.data;
};

export const getReviewsByProductApi = async (productId: string) => {
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data;
};

export const replyReviewApi = async (reviewId: string, reply: string) => {
  const res = await api.put(`/reviews/${reviewId}/reply`, { reply });
  return res.data;
};

export const deleteReviewApi = async (reviewId: string) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};
