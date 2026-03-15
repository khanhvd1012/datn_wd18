import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Avatar,
  Divider,
  Button,
  Stack,
  Chip
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetail = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.order) {
          setOrder(response.data.order);
        }
      } catch (error: any) {
        console.error("Error loading order detail:", error);
        
        // Xử lý lỗi token hết hạn
        if (error.response?.status === 401) {
          const errorMessage = error.response?.data?.message || "";
          if (errorMessage.includes("hết hạn") || errorMessage.includes("không hợp lệ")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
            navigate("/login");
            return;
          }
        }
        
        if (error.response?.status === 404) {
          setError("Đơn hàng không tồn tại");
        } else {
          setError("Không thể tải chi tiết đơn hàng");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetail();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Typography textAlign="center" mt={10}>
        Đang tải chi tiết đơn hàng...
      </Typography>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6, maxWidth: "950px" }}>
        <Typography textAlign="center" color="error" mt={10}>
          {error}
        </Typography>
        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
            sx={{
              background: "#ff5722",
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: "bold",
              "&:hover": {
                background: "#e64a19"
              }
            }}
          >
            Quay lại đơn hàng
          </Button>
        </Box>
      </Container>
    );
  }

  if (!order) {
    return (
      <Typography textAlign="center" mt={10}>
        Không tìm thấy đơn hàng
      </Typography>
    );
  }

  return (
    <Container sx={{ py: 6, maxWidth: "950px" }}>

      {/* TITLE */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Chi tiết đơn hàng #{order._id?.toString().slice(-6).toUpperCase() || id}
      </Typography>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          border: "1px solid #eee"
        }}
      >

        <CardContent>

          {/* ORDER INFO */}
          <Box
            sx={{
              background: "#fafafa",
              p: 3,
              borderRadius: 3,
              mb: 3
            }}
          >

            <Stack
              direction="row"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >

              <Box>
                <Typography fontWeight="bold">
                  Người nhận: {order.shipping_info?.name || "N/A"}
                </Typography>

                <Typography color="text.secondary">
                  Email: {order.shipping_info?.email || "N/A"}
                </Typography>

                <Typography color="text.secondary">
                  SĐT: {order.shipping_info?.phone || "N/A"}
                </Typography>

                <Typography color="text.secondary">
                  Địa chỉ: {order.shipping_info?.address || "N/A"}
                </Typography>

                <Typography color="text.secondary">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  Phương thức thanh toán: {
                    order.payment_method === "cod" ? "Thanh toán khi nhận hàng" :
                    order.payment_method === "bank" ? "Chuyển khoản" :
                    order.payment_method === "momo" ? "Ví MoMo" :
                    order.payment_method === "vnpay" ? "VNPay" :
                    "N/A"
                  }
                </Typography>
              </Box>

              <Chip
                label={
                  order.order_status === "pending" ? "Chờ xử lý" :
                  order.order_status === "confirmed" ? "Đã xác nhận" :
                  order.order_status === "processing" ? "Đang xử lý" :
                  order.order_status === "shipping" ? "Đang giao hàng" :
                  order.order_status === "delivered" ? "Đã giao hàng" :
                  order.order_status === "cancelled" ? "Đã hủy" :
                  "Chờ xử lý"
                }
                sx={{
                  background: 
                    order.order_status === "delivered" ? "#4caf50" :
                    order.order_status === "cancelled" ? "#f44336" :
                    order.order_status === "shipping" ? "#2196f3" :
                    "#ff5722",
                  color: "#fff",
                  fontWeight: "bold",
                  height: 32
                }}
              />

            </Stack>

          </Box>

          {/* PRODUCT LIST */}
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={2}
          >
            Sản phẩm trong đơn
          </Typography>

          {order.order_items?.map((item: any, index: number) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 2,
                borderBottom: "1px solid #eee"
              }}
            >
              {/* LEFT */}
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={item.image || ""}
                  variant="rounded"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2
                  }}
                />

                <Box>
                  <Typography fontWeight="bold">
                    {item.name}
                  </Typography>

                  <Typography color="text.secondary">
                    Số lượng: {item.quantity}
                  </Typography>

                  <Typography color="text.secondary">
                    Giá: {item.price?.toLocaleString("vi-VN")}₫
                  </Typography>
                </Box>
              </Box>

              {/* PRICE */}
              <Typography
                fontWeight="bold"
                fontSize={18}
                color="#ff5722"
              >
                {((item.price || 0) * (item.quantity || 0)).toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          ))}

          {/* TOTAL */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              background: "#fff7f4",
              borderRadius: 3
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Tạm tính:</Typography>
              <Typography>{order.subtotal?.toLocaleString("vi-VN")}₫</Typography>
            </Box>
            
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Phí ship:</Typography>
              <Typography>
                {order.shipping_fee === 0 ? "Miễn phí" : `${order.shipping_fee?.toLocaleString("vi-VN")}₫`}
              </Typography>
            </Box>

            {order.discount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Giảm giá:</Typography>
                <Typography color="success.main">
                  -{order.discount?.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>
            )}

            {order.coupon_discount > 0 && (
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Mã giảm giá:</Typography>
                <Typography color="success.main">
                  -{order.coupon_discount?.toLocaleString("vi-VN")}₫
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" justifyContent="space-between">
              <Typography
                fontSize={22}
                fontWeight="bold"
              >
                Tổng tiền:
              </Typography>
              <Typography
                fontSize={22}
                fontWeight="bold"
                color="#ff5722"
              >
                {order.total?.toLocaleString("vi-VN")}₫
              </Typography>
            </Box>
          </Box>

          {/* BUTTON */}
          <Box mt={4} textAlign="right">

            <Button
              variant="contained"
              onClick={() => navigate("/orders")}
              sx={{
                background: "#ff5722",
                px: 4,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                "&:hover": {
                  background: "#e64a19"
                }
              }}
            >
              Quay lại đơn hàng
            </Button>

          </Box>

        </CardContent>

      </Card>

    </Container>
  );
};

export default OrderDetail;