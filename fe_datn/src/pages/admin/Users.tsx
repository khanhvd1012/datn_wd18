import React from "react";
import { Box, Paper, Typography } from "@mui/material";

const Users = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <Box>
      <Typography variant="h4" mb={2} fontWeight="bold">Quản lý người dùng</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle1">Thông tin admin đang đăng nhập</Typography>
        <Typography>Email: {user?.email || "--"}</Typography>
        <Typography>Role: {user?.role || "--"}</Typography>
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Typography>Chức năng quản lý user sẽ được triển khai trực tiếp trên API nếu có endpoint `/users`.</Typography>
      </Box>
    </Box>
  );
};

export default Users;