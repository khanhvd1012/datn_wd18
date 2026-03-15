import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Divider,
  Breadcrumbs,
  Link,
  Stack
} from "@mui/material";

import { Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {

  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchCart = async () => {

    const res = await axios.get("http://localhost:3000/cart");

    setCart(res.data);

  };

  useEffect(() => {
    fetchCart();
  }, []);

  // UPDATE QUANTITY
  const updateQuantity = async (id: number, newQuantity: number) => {

    if (newQuantity < 1) return;

    await axios.patch(`http://localhost:3000/cart/${id}`, {
      quantity: newQuantity
    });

    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // 🔥 cập nhật Header
    window.dispatchEvent(new Event("cartUpdated"));

  };

  // REMOVE ITEM
  const removeItem = async (id: number) => {

    await axios.delete(`http://localhost:3000/cart/${id}`);

    setCart(prev =>
      prev.filter(item => item.id !== id)
    );

    // 🔥 cập nhật Header
    window.dispatchEvent(new Event("cartUpdated"));

  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (

    <Box sx={{ pt: 2, pb: 5 }}>

      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>

        <Link
          underline="hover"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Trang chủ
        </Link>

        <Typography>Giỏ hàng</Typography>

      </Breadcrumbs>

      {/* TITLE */}
      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
      >
        Giỏ hàng của bạn ({cart.length})
      </Typography>

      {cart.length === 0 ? (

        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            border: "1px solid #eee"
          }}
        >

          <Typography mb={2}>
            Giỏ hàng của bạn đang trống
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowLeft />}
            sx={{
              background: "#d70018",
              fontWeight: 600
            }}
            onClick={() => navigate("/")}
          >
            Tiếp tục mua sắm
          </Button>

        </Paper>

      ) : (

        <>

          {/* PRODUCT LIST */}
          <Paper
            sx={{
              borderRadius: 3,
              border: "1px solid #e5e7eb"
            }}
          >

            {cart.map((item, index) => (

              <Box key={item.id}>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3
                  }}
                >

                  {/* PRODUCT */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3
                    }}
                  >

                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        background: "#f9fafb",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #eee"
                      }}
                    >

                      <img
                        src={item.img}
                        alt={item.name}
                        style={{
                          width: 70,
                          height: 70,
                          objectFit: "contain"
                        }}
                      />

                    </Box>

                    <Box>

                      <Typography fontWeight={600}>
                        {item.name}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#d70018",
                          fontWeight: "bold",
                          mt: 1
                        }}
                      >
                        {item.price.toLocaleString()}₫
                      </Typography>

                    </Box>

                  </Box>

                  {/* QUANTITY */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid #ddd",
                      borderRadius: 2
                    }}
                  >

                    <IconButton
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      <Minus size={16} />
                    </IconButton>

                    <Typography sx={{ px: 2 }}>
                      {item.quantity}
                    </Typography>

                    <IconButton
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={16} />
                    </IconButton>

                  </Box>

                  {/* REMOVE */}
                  <IconButton
                    sx={{ color: "#d70018" }}
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </IconButton>

                </Box>

                {index !== cart.length - 1 && <Divider />}

              </Box>

            ))}

          </Paper>

          {/* TOTAL */}
          <Paper
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 3,
              border: "1px solid #e5e7eb"
            }}
          >

            <Typography variant="h6" mb={2}>
              Tổng thanh toán
            </Typography>

            <Typography
              sx={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#d70018",
                mb: 3
              }}
            >
              {totalPrice.toLocaleString()}₫
            </Typography>

            <Stack direction="row" spacing={2}>

              <Button
                variant="outlined"
                onClick={() => navigate("/")}
              >
                Tiếp tục mua
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: "#d70018",
                  px: 4,
                  fontWeight: "bold"
                }}
                onClick={() => navigate("/checkout")}
              >
                Thanh toán
              </Button>

            </Stack>

          </Paper>

        </>

      )}

    </Box>

  );

};

export default Cart;