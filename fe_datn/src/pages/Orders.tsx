import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {

    axios
      .get("http://localhost:3000/orders")
      .then(res => setOrders(res.data));

  }, []);

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
        return { label: "Chờ xác nhận", color: "warning" };

    }

  };

  return (

    <Box
      sx={{
        maxWidth: 900,
        margin: "auto",
        py: 5
      }}
    >

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Đơn hàng của bạn
      </Typography>

      <Stack spacing={3}>

        {orders.map(order => {

          const status = getStatus(order.status);

          return (

            <Paper
              key={order.id}
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 8 }
              }}
            >

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={3}
              >

                {/* INFO */}
                <Box>

                  <Typography fontWeight="bold" fontSize={16}>
                    Mã đơn: #{order.id}
                  </Typography>

                  <Typography color="text.secondary">
                    Khách: {order.customerName}
                  </Typography>

                  <Typography mt={1}>
                    Tổng tiền:
                    <b
                      style={{
                        color: "#ff5722",
                        marginLeft: 5
                      }}
                    >
                      {order.total?.toLocaleString()}₫
                    </b>
                  </Typography>

                  <Box mt={1}>

                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                    />

                  </Box>

                </Box>

                {/* BUTTON */}
                <Button
                  variant="contained"
                  onClick={() => navigate(`/orders/${order.id}`)}
                  sx={{
                    background: "#ff5722",
                    px: 3,
                    "&:hover": {
                      background: "#e64a19"
                    }
                  }}
                >
                  Xem chi tiết
                </Button>

              </Stack>

            </Paper>

          );

        })}

      </Stack>

    </Box>

  );

};

export default Orders;