import emailjs from "@emailjs/browser";
import type { Order } from "./orderService";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const EMAILJS_DELIVERED_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_DELIVERED_TEMPLATE_ID as string | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

const formatCurrency = (n: number) => (Number(n) || 0).toLocaleString("vi-VN") + "₫";

export async function sendOrderSuccessEmail(order: Order) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("Missing EmailJS env vars (VITE_EMAILJS_SERVICE_ID/TEMPLATE_ID/PUBLIC_KEY)");
  }

  const orderCode = `#${String(order._id).slice(-8).toUpperCase()}`;

  const itemsText = (order.order_items || [])
    .map((it) => `${it.name} x${it.quantity} - ${formatCurrency(it.price * it.quantity)}`)
    .join("\n");

  const templateParams = {
    to_email: order.shipping_info?.email,
    to_name: order.shipping_info?.name,
    order_code: orderCode,
    order_total: formatCurrency(order.total),
    shipping_name: order.shipping_info?.name,
    shipping_phone: order.shipping_info?.phone,
    shipping_address: order.shipping_info?.address,
    payment_method: order.payment_method,
    items: itemsText,
  };

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    { publicKey: EMAILJS_PUBLIC_KEY },
  );
}

export async function sendOrderDeliveredEmail(order: Order) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("Missing EmailJS env vars (VITE_EMAILJS_SERVICE_ID/PUBLIC_KEY)");
  }
  const deliveredTemplateId = EMAILJS_DELIVERED_TEMPLATE_ID || EMAILJS_TEMPLATE_ID;
  if (!deliveredTemplateId) {
    throw new Error("Missing delivered template id (VITE_EMAILJS_DELIVERED_TEMPLATE_ID)");
  }

  const deadline = order.confirmation_deadline_at
    ? new Date(order.confirmation_deadline_at).toLocaleDateString("vi-VN")
    : "";

  const templateParams = {
    to_email: order.shipping_info?.email,
    to_name: order.shipping_info?.name,
    order_code: `#${String(order._id).slice(-8).toUpperCase()}`,
    order_total: formatCurrency(order.total),
    shipping_name: order.shipping_info?.name,
    shipping_phone: order.shipping_info?.phone,
    shipping_address: order.shipping_info?.address,
    confirmation_deadline: deadline,
  };

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    deliveredTemplateId,
    templateParams,
    { publicKey: EMAILJS_PUBLIC_KEY },
  );
}

