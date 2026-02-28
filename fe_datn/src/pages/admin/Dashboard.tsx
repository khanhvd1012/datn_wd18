import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { getDashboardStats } from "../../services/dashboardService";

const Dashboardd = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Lỗi lấy dashboard:", error);
      }
    };

    fetchData();
  }, []);

  if (!stats) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Tổng sản phẩm: {stats.totalProducts}</Typography>
        <Typography variant="h6">Tổng user: {stats.totalUsers}</Typography>
        <Typography variant="h6">Tổng đơn hàng: {stats.totalOrders}</Typography>
      </Paper>
    </Box>
  );
};

export default Dashboardd;