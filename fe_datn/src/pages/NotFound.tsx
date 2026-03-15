import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";

const NotFound = () => {

  const navigate = useNavigate();

  return (

    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f6f8fb",
        textAlign: "center",
        px: 2
      }}
    >

      <ErrorOutlineIcon
        sx={{
          fontSize: 100,
          color: "#d70018",
          mb: 2
        }}
      />

      <Typography
        variant="h2"
        fontWeight="bold"
        color="#d70018"
      >
        404
      </Typography>

      <Typography
        variant="h6"
        sx={{ mb: 2 }}
      >
        Trang bạn tìm kiếm không tồn tại
      </Typography>

      <Typography
        color="gray"
        sx={{ mb: 4 }}
      >
        Có thể link đã bị thay đổi hoặc trang đã bị xoá
      </Typography>

      <Button
        variant="contained"
        sx={{
          background: "#d70018",
          px: 4,
          py: 1.2,
          borderRadius: "8px",
          textTransform: "none",
          "&:hover": {
            background: "#b80014"
          }
        }}
        onClick={() => navigate("/")}
      >
        Quay về trang chủ
      </Button>

    </Box>

  );

};

export default NotFound;
