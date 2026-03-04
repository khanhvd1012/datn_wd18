import api from "./api";

export const getDashboardStatsApi = async () => {
  const res = await api.get("/dashboard");
  return res.data.data;
};

export const getStockDashboardApi = async () => {
  const res = await api.get("/dashboard/stock");
  return res.data.data;
};

export const getVoucherDashboardApi = async () => {
  const res = await api.get("/dashboard/voucher");
  return res.data.data;
};