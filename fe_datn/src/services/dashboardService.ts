import axios from "axios";
import API from "./api";


export const getDashboardStats = async () => {
  const res = await axios.get(`${API}/dashboard`);
  return res.data;
};

export const getStockDashboard = async () => {
  const res = await axios.get(`${API}/stock`);
  return res.data;
};

export const getVoucherDashboard = async () => {
  const res = await axios.get(`${API}/voucher`);
  return res.data;
};