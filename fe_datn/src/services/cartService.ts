import api from "./api";

export interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
  };
  variant?: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
  totalPrice: number;
}

export const getCartApi = async (): Promise<CartItem[]> => {
  const res = await api.get("/cart");
  const items = res.data.cart.items || [];
  return items.map((it: any) => ({
    ...it,
    product: it.product_id,
    variant: it.variant_id,
    totalPrice: (it.price || 0) * (it.quantity || 0)
  }));
};

export const addToCartApi = async (data: {
  product_id: string;
  variant_id?: string;
  quantity: number;
}): Promise<CartItem> => {
  const res = await api.post("/cart/add", data);
  return res.data;
};

export const updateCartItemApi = async (
  cartItemId: string,
  quantity: number,
): Promise<CartItem> => {
  const res = await api.put(`/cart/update/${cartItemId}`, { quantity });
  return res.data;
};

export const removeCartItemApi = async (cartItemId: string): Promise<void> => {
  await api.delete(`/cart/remove/${cartItemId}`);
};

export const clearCartApi = async (): Promise<void> => {
  await api.delete("/cart/clear");
};

export const restoreCartItemApi = async (
  cartItemId: string,
): Promise<CartItem> => {
  const res = await api.patch(`/cart/restore/${cartItemId}`);
  return res.data;
};
