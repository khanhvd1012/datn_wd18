import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        }
      } catch (error: any) {
        console.error("Error loading orders:", error);
        
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
        
        alert("Không thể tải lịch sử đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (

    <Container sx={{ py: 6, maxWidth: "1100px" }}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={5}
        textAlign="center"
      >
        Lịch sử đơn hàng
      </Typography>

      {loading ? (
        <Typography textAlign="center">
          Đang tải lịch sử đơn hàng...
        </Typography>
      ) : orders.length === 0 ? (
        <Typography textAlign="center">
          Chưa có đơn hàng nào
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order: any) => (
            <Grid item xs={12} key={order._id}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 4,
                  transition: "0.3s",
                  "&:hover": { boxShadow: 10 }
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={3}
                    alignItems="center"
                  >
                    {/* LEFT */}
                    <Box>
                      <Typography fontWeight="bold" fontSize={18}>
                        Đơn hàng #{order._id.toString().slice(-6).toUpperCase()}
                      </Typography>

                      <Typography color="text.secondary">
                        Người nhận: {order.shipping_info?.name || "N/A"}
                      </Typography>

                      <Typography color="text.secondary">
                        Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </Typography>

                      <Stack direction="row" spacing={1} mt={2}>
                        {order.order_items?.slice(0, 3).map((item: any, index: number) => (
                          <Avatar
                            key={index}
                            src={item.image || ""}
                            variant="rounded"
                            sx={{ width: 50, height: 50 }}
                          />
                        ))}
                      </Stack>
                    </Box>

                    {/* CENTER */}
                    <Box textAlign="center">
                      <Typography color="text.secondary">
                        Tổng tiền
                      </Typography>

                      <Typography
                        fontWeight="bold"
                        fontSize={22}
                        color="#ff5722"
                      >
                        {order.total?.toLocaleString("vi-VN")}₫
                      </Typography>
                    </Box>

                    {/* RIGHT */}
                    <Box textAlign="right">
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
                        color={
                          order.order_status === "delivered" ? "success" :
                          order.order_status === "cancelled" ? "error" :
                          order.order_status === "shipping" ? "info" :
                          "warning"
                        }
                        sx={{ mb: 2, fontWeight: "bold" }}
                      />

                      <br />

                      <Button
                        variant="contained"
                        onClick={() => navigate(`/orders/${order._id}`)}
                        sx={{
                          background: "#ff5722",
                          borderRadius: 2,
                          px: 3,
                          "&:hover": { background: "#e64a19" }
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

    </Container>
  );
};

export default Orders;