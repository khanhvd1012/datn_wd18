import React from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";

import deal1 from "../img/deal_1.jpg";
import deal2 from "../img/deal_cap_sac.webp";
import deal3 from "../img/deal_de sac_k_day.webp";
import deal4 from "../img/deal_gia_do_chong_xoay.webp";
import deal5 from "../img/deal_gia_do_ipa.webp";
import deal6 from "../img/deal_pin_du_phong.webp";
import deal7 from "../img/deal_tainghe.webp";

const deals = [
  { img: deal2, name: "Cáp sạc nhanh" },
  { img: deal3, name: "Đế sạc không dây" },
  { img: deal4, name: "Giá đỡ chống xoay" },
  { img: deal5, name: "Giá đỡ iPad" },
  { img: deal6, name: "Pin dự phòng" },
  { img: deal7, name: "Tai nghe Bluetooth" },
];

const Deal = () => {
  return (
    <Box sx={{ background: "#ede8e8", py: 4, display: "flex", justifyContent: "center" }}>
      
      {/* Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          px: 2,
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Typography
              sx={{
                color: "#ee4d2d",
                fontWeight: "bold",
                fontSize: 22,
              }}
            >
              MOBITECH MALL
            </Typography>

            <Typography sx={{ color: "#1c1c1c", fontSize: 14 }}>
              Trả Hàng Miễn Phí 15 Ngày
            </Typography>

            <Typography sx={{ color: "#1c1c1c", fontSize: 14 }}>
              Hàng Chính Hãng 100%
            </Typography>

            <Typography sx={{ color: "#1c1c1c", fontSize: 14 }}>
              Miễn Phí Vận Chuyển
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Grid container spacing={3} justifyContent="center">
          
          {/* Banner */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={deal1}
              alt="Banner"
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 2,
                objectFit: "cover",
              }}
            />
          </Grid>

          {/* Deals */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {deals.map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Box
                    sx={{
                      background: "#fff",
                      borderRadius: 2,
                      textAlign: "center",
                      p: 2,
                      height: "100%",
                      cursor: "pointer",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={item.img}
                      alt={item.name}
                      sx={{
                        width: "100%",
                        height: 110,
                        objectFit: "contain",
                        mb: 1,
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default Deal;