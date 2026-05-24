export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "refunded"
  | "completed";

export interface ReturnItem {
  product_id: string;
  variant_id?: string | null;
  quantity: number;
}

export interface ReturnRequest {
  _id: string;
  order_id: string;
  user_id: string;
  items: ReturnItem[];
  reason: string;
  images: string[];
  status: ReturnStatus;
  refund_amount: number;
  createdAt: string;
  updatedAt: string;
}