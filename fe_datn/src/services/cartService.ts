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

const normalizeProduct = (raw: unknown, fallbackPrice = 0) => {
  if (!raw || typeof raw === "string") {
    return {
      _id: typeof raw === "string" ? raw : "",
      name: "Sản phẩm không khả dụng",
      images: [] as string[],
      price: fallbackPrice,
    };
  }
  const p = raw as Record<string, unknown>;
  return {
    _id: String(p._id ?? p.id ?? ""),
    name: String(p.name ?? "Sản phẩm"),
    images: Array.isArray(p.images) ? (p.images as string[]) : [],
    price: Number(p.price ?? fallbackPrice) || 0,
  };
};

const normalizeVariant = (raw: unknown) => {
  if (!raw || typeof raw === "string") return undefined;
  const v = raw as Record<string, unknown>;
  return {
    _id: String(v._id ?? v.id ?? ""),
    name: String(v.name ?? ""),
    price: Number(v.price ?? 0) || 0,
    images: Array.isArray(v.images) ? (v.images as string[]) : [],
  };
};

export const getCartApi = async (): Promise<CartItem[]> => {
  const res = await api.get("/cart");
  const items = res.data?.cart?.items ?? [];
  return items.map((it: Record<string, unknown>) => {
    const linePrice = Number(it.price ?? 0) || 0;
    const quantity = Number(it.quantity ?? 1) || 1;
    const product = normalizeProduct(it.product_id ?? it.product, linePrice);
    const variant = normalizeVariant(it.variant_id ?? it.variant);
    const unitPrice = variant?.price || product.price || linePrice;

    return {
      _id: String(it._id ?? ""),
      product,
      variant,
      quantity,
      totalPrice: unitPrice * quantity,
    };
  });
};

export const addToCartApi = async (data: {
  product_id: string;
  variant_id?: string;
  quantity: number;
}): Promise<any> => {
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
