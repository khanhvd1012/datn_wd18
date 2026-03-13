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
  Stack,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:3000/orders?customerName=${user.name}`)
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      });

  }, [navigate]);

  const getStatus = (status) => {

    switch (status) {

      case "pending":
        return { label: "Chờ xác nhận", color: "warning" };

      case "shipping":
        return { label: "Đang giao", color: "info" };

      case "completed":
        return { label: "Hoàn thành", color: "success" };

      case "cancel":
        return { label: "Đã hủy", color: "error" };

      default:
        return { label: "Đã đặt hàng", color: "default" };
    }

  };

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
        <Typography mt={2}>Đang tải đơn hàng...</Typography>
      </Box>
    );

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

      {orders.length === 0 && (
        <Typography textAlign="center">
          Bạn chưa có đơn hàng nào
        </Typography>
      )}

      <Grid container spacing={3}>

        {orders.map(order => {

          const status = getStatus(order.status);

          return (

            <Grid item xs={12} key={order.id}>

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
                        Đơn hàng #{order.id}
                      </Typography>

                      <Typography color="text.secondary">
                        Người nhận: {order.customerName}
                      </Typography>

                      <Typography color="text.secondary">
                        Ngày đặt: {new Date(order.createdAt).toLocaleString()}
                      </Typography>

                      <Stack direction="row" spacing={1} mt={2}>

                        {order.items?.slice(0, 3).map(item => (
                          <Avatar
                            key={item.id}
                            src={item.img}
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
                        {order.total?.toLocaleString()}₫
                      </Typography>

                    </Box>

                    {/* RIGHT */}
                    <Box textAlign="right">

                      <Chip
                        label={status.label}
                        color={status.color}
                        sx={{ mb: 2, fontWeight: "bold" }}
                      />

                      <br />

                      <Button
                        variant="contained"
                        onClick={() => navigate(`/orders/${order.id}`)}
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

          );

        })}

      </Grid>

    </Container>

  );
};

export default Orders;
