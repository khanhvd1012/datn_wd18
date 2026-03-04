import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
} from "@mui/material";
import deal1 from "../img/deal_1.jpg";
import deal2 from "../img/deal_cap_sac.webp";
import deal3 from "../img/deal_de sac_k_day.webp";
import deal4 from "../img/deal_gia_do_chong_xoay.webp";
import deal5 from "../img/deal_gia_do_ipa.webp";
import deal6 from "../img/deal_pin_du_phong.webp";
import deal7 from "../img/deal_tainghe.webp";

const Deal = () => {
  return (
    <Box sx={{ background: "#1a1919", py: 2 }}>
      <div >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography
              sx={{
                color: "#ee4d2d",
                fontWeight: "bold",
                fontSize: 22,
                pl: 2,
              }}
            >
              MOBITECH MALL
            </Typography>

            <Typography sx={{ color: "#fdfdfd" }}>
              Trả Hàng Miễn Phí 15 Ngày
            </Typography>

            <Typography sx={{ color: "#fdfdfd" }}>
              Hàng Chính Hãng 100%
            </Typography>

            <Typography sx={{ color: "#fdfdfd" }}>
              Miễn Phí Vận Chuyển
            </Typography>
          </Box>

        </Box>

        <Grid container spacing={3}>
          {/* Banner trái */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={deal1}
              alt="Shopee Banner"
              sx={{
                width: "500px",
                height: "100%",
                borderRadius: 1,
                objectFit: "cover",
                pl: 0.2,
              }}
            />
          </Grid>

          
        </Grid>
      </div>
    </Box>
  );
};

export default Deal;