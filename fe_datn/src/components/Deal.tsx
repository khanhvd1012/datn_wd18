import React from "react";
import { Box, Typography } from "@mui/material";

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
    <Box sx={{ background: "#1a1919", py: 4, display: "flex", justifyContent: "center" }}>
      
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

            <Typography sx={{ color: "#fff", fontSize: 14 }}>
              Trả Hàng Miễn Phí 15 Ngày
            </Typography>

            <Typography sx={{ color: "#fff", fontSize: 14 }}>
              Hàng Chính Hãng 100%
            </Typography>

            <Typography sx={{ color: "#fff", fontSize: 14 }}>
              Miễn Phí Vận Chuyển
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, alignItems: "start" }}>
          <Box sx={{ gridColumn: "span 12", '@media (min-width: 900px)': { gridColumn: 'span 4' } }}>
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
          </Box>

          {/* Deals */}
          <Box sx={{ gridColumn: 'span 12', '@media (min-width: 900px)': { gridColumn: 'span 8' } }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {deals.map((item, index) => (
                <Box key={index} sx={{}}>
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

                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{item.name}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default Deal;