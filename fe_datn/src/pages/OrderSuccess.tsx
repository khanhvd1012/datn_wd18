import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Divider
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate, useLocation } from "react-router-dom";

const OrderSuccess = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  return (

    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        p: 3
      }}
    >

      <Paper
        elevation={4}
        sx={{
          p: 6,
          borderRadius: 4,
          textAlign: "center",
          maxWidth: 520,
          width: "100%"
        }}
      >

        {/* ICON */}
        <CheckCircleIcon
          sx={{
            fontSize: 90,
            color: "#4caf50",
            mb: 2,
            animation: "pop 0.6s ease"
          }}
        />

        {/* TITLE */}
        <Typography variant="h4" fontWeight="bold">
          Đặt hàng thành công
        </Typography>

        {/* DESC */}
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Cảm ơn bạn đã mua hàng tại <b>Mobitech</b>
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ORDER INFO */}
        {order && (

          <Box sx={{ textAlign: "left", mb: 3 }}>

            <Typography>
              Mã đơn hàng: <b>#{order.id}</b>
            </Typography>

            <Typography>
              Tổng tiền:{" "}
              <b style={{ color: "#ff5722" }}>
                {order.total?.toLocaleString()}₫
              </b>
            </Typography>

          </Box>

        )}

        {/* BUTTONS */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
        >

          <Button
            variant="outlined"
            onClick={() => navigate("/")}
          >
            Tiếp tục mua
          </Button>

          {order && (
            <Button
              variant="contained"
              onClick={() => navigate(`/orders/${order.id}`)}
              sx={{
                background: "#ff5722",
                "&:hover": { background: "#e64a19" }
              }}
            >
              Xem chi tiết
            </Button>
          )}

          <Button
            variant="contained"
            onClick={() => navigate("/orders")}
            sx={{
              background: "#ff5722",
              "&:hover": { background: "#e64a19" }
            }}
          >
            Xem đơn hàng
          </Button>

        </Stack>

      </Paper>

      <style>
        {`
          @keyframes pop {
            0% { transform: scale(0.6); opacity:0 }
            100% { transform: scale(1); opacity:1 }
          }
        `}
      </style>

    </Box>

  );
};

export default OrderSuccess;
