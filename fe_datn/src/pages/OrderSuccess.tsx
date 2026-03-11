import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {

  const navigate = useNavigate();

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
          maxWidth: 500,
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
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Đặt hàng thành công
        </Typography>

        {/* DESC */}
        <Typography
          color="text.secondary"
          sx={{ mt: 2, mb: 4 }}
        >
          Cảm ơn bạn đã mua hàng tại <b>Mobitech</b>.  
          Đơn hàng của bạn đang được xử lý.
        </Typography>

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
            0% { transform: scale(0.5); opacity:0 }
            100% { transform: scale(1); opacity:1 }
          }
        `}
      </style>

    </Box>

  );
};

export default OrderSuccess;