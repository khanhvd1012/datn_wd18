import api from "./api";

export interface OrderItem {
  product: string;
  variant?: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  user_id?: string;
  order_items: {
    product_id: string;
    variant_id?: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  shipping_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment_method: string;
  payment_status: string;
  order_status: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  coupon_discount: number;
  total: number;
  coupon_code?: string;
  notes?: string;
  delivery_proof_images?: string[];
  delivered_at?: string;
  confirmation_deadline_at?: string | null;
  customer_confirmed_received?: boolean;
  confirmed_received_at?: string | null;
  confirmed_received_by?: "user" | "auto" | null;
  delivery_rating?: number | null;
  delivery_feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  shipping_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment_method: string;
  notes?: string;
  coupon_code?: string;
}

export const createOrderApi = async (
  orderData: CreateOrderData,
): Promise<Order> => {
  const response = await api.post("/orders", orderData);
  return response.data.order;
};

export const getOrdersApi = async (): Promise<Order[]> => {
  const response = await api.get("/orders");
  return response.data.orders;
};

export const getOrderByIdApi = async (orderId: string): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data.order;
};

export const updateOrderStatusApi = async (
  orderId: string,
  orderStatus: string,
  paymentStatus?: string,
  cancelReason?: string,
): Promise<Order> => {
  const response = await api.put(`/orders/${orderId}`, {
    order_status: orderStatus,
    ...(paymentStatus ? { payment_status: paymentStatus } : {}),
    ...(cancelReason ? { cancel_reason: cancelReason } : {}),
  });
  return response.data.order;
};

export const cancelOrderApi = async (orderId: string, cancelReason?: string): Promise<Order> => {
  const response = await api.patch(`/orders/${orderId}/cancel`, { cancel_reason: cancelReason });
  return response.data.order;
};

export const confirmOrderReceivedApi = async (
  orderId: string,
  payload?: { delivery_rating?: number; delivery_feedback?: string },
): Promise<Order> => {
  const response = await api.patch(`/orders/${orderId}/confirm-received`, payload || {});
  return response.data.order;
};

export const isOnlinePaymentMethod = (method: string) =>
  ["vnpay", "momo", "bank"].includes(method);

export const getAdminOrdersApi = async (params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/orders/admin/all", { params });
  return response.data;
};

/** @deprecated Không được phép xóa đơn hàng */
export const deleteOrderApi = async (orderId: string) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};
