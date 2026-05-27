import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Container,
  Tabs,
  Tab,
  Divider,
  alpha,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

import {
  LocalShippingOutlined,
  CheckCircleOutline,
  ScheduleOutlined,
  CancelOutlined,
  ShoppingBagOutlined,
  Inventory2Outlined
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { confirmOrderReceivedApi, getOrdersApi } from "../services/orderService";
import type { Order } from "../services/orderService";
import { createReturnRequest } from "../services/returnService";

// Helper function
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://placehold.co/100x100?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("uploads/")) {
    return `http://localhost:3000/${imagePath}`;
  }
  return `http://localhost:3000/uploads/products/${imagePath}`;
};

const Orders = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("all");
  const navigate = useNavigate();

  // ================= RETURN STATE =================
  const [returnOpen, setReturnOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnImages, setReturnImages] = useState<File[]>([]);
  const [returnLoading, setReturnLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  
  const handleOpenReturn = (order: Order) => {
console.log(order);
console.log(order.order_items);
  setSelectedOrderId(order._id);

  const items = order.order_items.map((item) => ({
    product_id:
  typeof item.product_id === "object"
    ? item.product_id._id
    : item.product_id,
    variant_id: item.variant_id || null,
    quantity: item.quantity
  }));

  setSelectedItems(items);

  setReturnReason("");
  setReturnImages([]);

  setReturnOpen(true);
};
 
    const handleSubmitReturn = async () => {

  if (!selectedOrderId) return;
  if (!returnReason.trim()) {
    alert("Vui lòng nhập lý do hoàn hàng");
    return;
  }
  if (!returnImages.length) {
    alert("Vui lòng tải lên ít nhất 1 ảnh minh chứng");
    return;
  }

  try {

    setReturnLoading(true);
console.log(selectedItems);
    const formData = new FormData();
    formData.append("order_id", selectedOrderId);
    formData.append("reason", returnReason);
    formData.append("items", JSON.stringify(selectedItems));
    returnImages.forEach((file) => {
      formData.append("return_images", file);
    });

    await createReturnRequest(formData);

    alert("Gửi yêu cầu hoàn hàng thành công");

    setReturnOpen(false);

    setReturnReason("");

    setSelectedItems([]);
    setReturnImages([]);

    fetchOrders();

  } catch (err) {

    console.error(err);
    alert("Gửi yêu cầu hoàn hàng thất bại. Vui lòng thử lại hoặc kiểm tra đăng nhập.");

  } finally {

    setReturnLoading(false);

  }
};

  const getReturnStatusInfo = (status?: string) => {

  switch (status) {

    case "requested":
      return {
        label: "Đang chờ duyệt hoàn",
        color: "warning"
      };

    case "approved":
      return {
        label: "Đã duyệt hoàn",
        color: "info"
      };

    case "received":
      return {
        label: "Đã nhận hàng hoàn",
        color: "secondary"
      };

    case "refunded":
      return {
        label: "Đã hoàn tiền",
        color: "success"
      };

    case "rejected":
      return {
        label: "Từ chối hoàn hàng",
        color: "error"
      };

    default:
      return null;
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdersApi();
      setOrders(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", color: "warning", icon: <ScheduleOutlined fontSize="small" /> };
      case "confirmed":
        return { label: "Đã xác nhận", color: "success", icon: <CheckCircleOutline fontSize="small" /> };
      case "processing":
        return { label: "Đang xử lý", color: "info", icon: <Inventory2Outlined fontSize="small" /> };
      case "shipping":
        return { label: "Đang giao", color: "secondary", icon: <LocalShippingOutlined fontSize="small" /> };
      case "delivered":
        return { label: "Đã giao hàng", color: "success", icon: <LocalShippingOutlined fontSize="small" /> };
      case "received":
        return { label: "Đã nhận hàng thành công", color: "success", icon: <CheckCircleOutline fontSize="small" /> };
      case "cancelled":
        return { label: "Đã hủy", color: "error", icon: <CancelOutlined fontSize="small" /> };
      default:
        return { label: status, color: "default", icon: <ShoppingBagOutlined fontSize="small" /> };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (tabValue === "all") return true;
    if (tabValue === "delivered") {
      return order.order_status === "delivered" || order.order_status === "received";
    }
    return order.order_status === tabValue;
  });

  const handleConfirmReceived = async (orderId: string) => {
    try {
      setConfirmingOrderId(orderId);
      await confirmOrderReceivedApi(orderId);
      alert("Xác nhận đã nhận hàng thành công");
      fetchOrders();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Không thể xác nhận nhận hàng");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", pb: 10, textAlign: 'left' }}>

      {/* HEADER */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        py: { xs: 5, md: 8 },
        mb: 6,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700}>
            Lịch sử mua hàng
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md">

        {/* TABS */}
        <Paper elevation={0} sx={{ borderRadius: 3, mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} scrollButtons="auto">
            <Tab label="Tất cả" value="all" />
            <Tab label="Chờ xác nhận" value="pending" />
            <Tab label="Đã giao" value="delivered" />
            <Tab label="Đã hủy" value="cancelled" />
          </Tabs>
        </Paper>

        {/* LIST */}
        <Stack spacing={3}>
          {filteredOrders.map((order) => {
            const status = getStatusInfo(order.order_status);
            const firstItem = order.order_items[0];

            return (
              <Paper key={order._id} sx={{ p: 2, borderRadius: 3 }}>

                {/* HEADER ORDER */}
              <Box display="flex" gap={1}>

          <Chip
            icon={status.icon}
            label={status.label}
            color={status.color as any}
          />

          {order.return_status && (() => {

            const returnStatus =
              getReturnStatusInfo(order.return_status);

            if (!returnStatus) return null;

            return (
              <Chip
                label={returnStatus.label}
                color={returnStatus.color as any}
                variant="outlined"
              />
            );

          })()}

        </Box>

                {/* BODY */}
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Box>
                    <Typography fontWeight={600}>
                      {firstItem?.name}
                    </Typography>
                    <Typography variant="body2">
                      {firstItem?.quantity} sản phẩm
                    </Typography>
                  </Box>

                  <Typography fontWeight={700}>
                    {order.total?.toLocaleString()}₫
                  </Typography>
                </Box>

                {/* ACTION */}
                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="flex-end" gap={2}>
                  {order.order_status === "delivered" && (
                    <Button
                      variant="contained"
                      color="success"
                      disabled={confirmingOrderId === order._id}
                      onClick={() => handleConfirmReceived(order._id)}
                    >
                      {confirmingOrderId === order._id ? "Đang xác nhận..." : "Đã nhận được hàng"}
                    </Button>
                  )}

                  {/*  RETURN BUTTON */}
                  {order.order_status === "received"
                && !order.return_requested && (
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleOpenReturn(order)}
                    >
                      Hoàn hàng
                    </Button>
                  )}

                  <Button
                    variant="contained"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    Chi tiết
                  </Button>

                </Box>
              </Paper>
            );
          })}
        </Stack>

      </Container>

      {/* ================= RETURN DIALOG ================= */}
      <Dialog open={returnOpen} onClose={() => setReturnOpen(false)} fullWidth>
        <DialogTitle>Yêu cầu hoàn hàng</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Lý do hoàn hàng"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            type="file"
            fullWidth
            inputProps={{ multiple: true, accept: "image/*" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReturnImages(Array.from(e.target.files || []))
            }
            sx={{ mt: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            Bắt buộc tải lên ít nhất 1 ảnh minh chứng (tối đa 5 ảnh).
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setReturnOpen(false)}>
            Huỷ
          </Button>

          <Button
  color="error"
  variant="contained"
  disabled={returnLoading || !returnReason.trim() || returnImages.length === 0}
   onClick={handleSubmitReturn}
>
            {returnLoading ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};


export default Orders;