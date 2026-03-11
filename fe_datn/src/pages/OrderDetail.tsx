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

  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/orders/${id}`)
      .then(res => setOrder(res.data));
  }, [id]);

  if (!order)
    return (
      <Typography textAlign="center" mt={10}>
        Loading...
      </Typography>
    );

  return (
    <Container sx={{ py: 6, maxWidth: "950px" }}>

      {/* TITLE */}
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Chi tiết đơn hàng #{order.id}
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
                  Người nhận: {order.customerName}
                </Typography>

                <Typography color="text.secondary">
                  SĐT: {order.phone}
                </Typography>

                <Typography color="text.secondary">
                  Địa chỉ: {order.address}
                </Typography>

                <Typography color="text.secondary">
                  Ngày đặt: {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Chip
                label="Đã đặt hàng"
                sx={{
                  background: "#ff5722",
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

          {order.items?.map(item => (

            <Box
              key={item.id}
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
                  src={item.img}
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
                    Giá: {item.price.toLocaleString()}₫
                  </Typography>

                </Box>

              </Box>

              {/* PRICE */}
              <Typography
                fontWeight="bold"
                fontSize={18}
                color="#ff5722"
              >
                {(item.price * item.quantity).toLocaleString()}₫
              </Typography>

            </Box>

          ))}

          {/* TOTAL */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              background: "#fff7f4",
              borderRadius: 3,
              textAlign: "right"
            }}
          >

            <Typography
              fontSize={22}
              fontWeight="bold"
              color="#ff5722"
            >
              Tổng tiền: {order.total?.toLocaleString()}₫
            </Typography>

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