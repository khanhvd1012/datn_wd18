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
): Promise<Order> => {
  const response = await api.put(`/orders/${orderId}`, {
    order_status: orderStatus,
    ...(paymentStatus ? { payment_status: paymentStatus } : {}),
  });
  return response.data.order;
};

export const getAdminOrdersApi = async (params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/orders/admin/all", { params });
  return response.data;
};

export const deleteOrderApi = async (orderId: string) => {
  const response = await api.delete(`/orders/${orderId}`);
  return response.data;
};
