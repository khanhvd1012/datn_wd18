import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

const Cart = () => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          maxWidth: 500,
        }}
      >
        <ShoppingCartOutlinedIcon
          sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
        />

        <Typography variant="h5" fontWeight="bold" mb={1}>
          Giỏ hàng trống
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Bạn chưa thêm sản phẩm nào vào giỏ hàng
        </Typography>

        <Button variant="contained" color="error" href="/products">
          Tiếp tục mua sắm
        </Button>
      </Paper>
    </Box>
  );
};

export default Cart;
