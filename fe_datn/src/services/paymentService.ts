import api from "./api";

export interface VNPayPaymentData {
  orderId: string;
}

export interface MockPaymentData {
  orderId: string;
}

export const createVNPayPaymentApi = async (data: VNPayPaymentData) => {
  const response = await api.post("/payment/vnpay/create", data);
  return response.data;
};

export const processMockPaymentApi = async (data: MockPaymentData) => {
  const response = await api.post("/payment/mock/process", data);
  return response.data;
};

export const getPaymentInfoApi = async () => {
  const response = await api.get("/payment/info");
  return response.data;
};
