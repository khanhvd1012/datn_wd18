import React, { useEffect, useState } from "react";
import api from "../services/api";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Container,
  Divider,
  Breadcrumbs,
  Link,
  Skeleton,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (err) {
        console.error("Lỗi load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatus = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", color: "warning" as const };
      case "confirmed":
        return { label: "Đã xác nhận", color: "info" as const };
      case "processing":
        return { label: "Đang xử lý", color: "info" as const };
      case "shipping":
        return { label: "Đang giao hàng", color: "primary" as const };
      case "delivered":
        return { label: "Đã giao hàng", color: "success" as const };
      case "completed":
        return { label: "Hoàn thành", color: "success" as const };
      case "cancelled":
        return { label: "Đã hủy", color: "error" as const };
      default:
        return { label: "Chờ xác nhận", color: "warning" as const };
    }
  };

  const formatPrice = (price: number) => {
    return (price || 0).toLocaleString("vi-VN") + "₫";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          underline="hover"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </Link>
        <Typography>Đơn hàng của tôi</Typography>
      </Breadcrumbs>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Đơn hàng của bạn
      </Typography>

      {loading ? (
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Paper key={i} sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height={30} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="30%" />
            </Paper>
          ))}
        </Stack>
      ) : orders.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Bạn chưa có đơn hàng nào
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              background: "#d70018",
              "&:hover": { background: "#b71c1c" }
            }}
          >
            Bắt đầu mua sắm
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {orders.map((order: any) => {
            const status = getStatus(order.order_status || order.status);

            return (
              <Paper
                key={order._id || order.id}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 4 }
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2
                  }}
                >
                  <Box>
                    <Typography fontWeight="bold" fontSize={16}>
                      Mã đơn: #{(order._id || order.id)?.toString().slice(-6).toUpperCase()}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Ngày đặt: {new Date(order.createdAt || order.created_at).toLocaleDateString("vi-VN")}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Khách hàng: {order.shipping_info?.name || order.customerName}
                    </Typography>
                  </Box>

                  <Chip
                    label={status.label}
                    color={status.color}
                    size="small"
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Order Items Preview */}
                <Box sx={{ mb: 2 }}>
                  {(order.order_items || order.items || []).slice(0, 2).map((item: any, index: number) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 1
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image || item.img}
                        onError={(e: any) => {
                          e.target.src = "https://via.placeholder.com/50x50?text=No+Image";
                        }}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "contain",
                          borderRadius: 1,
                          bgcolor: "#f5f5f5"
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" noWrap>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SL: {item.quantity} × {formatPrice(item.price)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {(order.order_items || order.items || []).length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      ... và {(order.order_items || order.items || []).length - 2} sản phẩm khác
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Tổng tiền:
                    </Typography>
                    <Typography
                      fontWeight="bold"
                      fontSize={18}
                      color="#d70018"
                    >
                      {formatPrice(order.total)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate(`/orders/${order._id || order.id}`)}
                    sx={{
                      background: "#d70018",
                      px: 3,
                      "&:hover": {
                        background: "#b71c1c"
                      }
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default Orders;
