import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getDashboardStatsApi } from "../../services/dashboardService";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getDashboardStatsApi();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return <Typography>Không lấy được số liệu</Typography>;
  }

  const cards = [
    { title: "Sản phẩm", value: stats.products?.total ?? 0, color: "#0288d1" },
    { title: "Danh mục", value: stats.categories?.total ?? 0, color: "#2e7d32" },
    { title: "Thương hiệu", value: stats.brands?.total ?? 0, color: "#6a1b9a" },
    { title: "Voucher", value: stats.vouchers?.total ?? 0, color: "#f57c00" },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Bảng điều khiển</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}>
        {cards.map((card) => (
          <Card key={card.title} sx={{ borderLeft: `5px solid ${card.color}` }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">{card.title}</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{card.value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
