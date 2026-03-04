import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import { getDashboardStatsApi } from "../../services/dashboardService";

const Dashboard = () => {

  const [stats, setStats] = useState<any>(null);

  useEffect(() => {

    const fetch = async () => {

      const data = await getDashboardStatsApi();

      setStats(data);

    };

    fetch();

  }, []);

  if (!stats) return <>Loading...</>;

  const cards = [
    { title: "Products", value: stats.products.total },
    { title: "Categories", value: stats.categories.total },
    { title: "Brands", value: stats.brands.total },
    { title: "Vouchers", value: stats.vouchers.total },
  ];

  return (

    <Grid container spacing={3}>

      {cards.map((card) => (

        <Grid item xs={3} key={card.title}>

          <Paper sx={{ p: 3 }}>

            <Typography variant="h6">
              {card.title}
            </Typography>

            <Typography variant="h4">
              {card.value}
            </Typography>

          </Paper>

        </Grid>

      ))}

    </Grid>

  );
};

export default Dashboard;