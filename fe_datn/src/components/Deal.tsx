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
    <Box sx={{ background: "#f5f5f5", py: 5 }}>
      
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>

        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              color: "#ee4d2d",
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            MOBITECH MALL
          </Typography>

          <Typography sx={{ fontSize: 14 }}>
            🔁 Trả Hàng Miễn Phí 15 Ngày
          </Typography>

          <Typography sx={{ fontSize: 14 }}>
            ✔ Hàng Chính Hãng 100%
          </Typography>

          <Typography sx={{ fontSize: 14 }}>
            🚚 Miễn Phí Vận Chuyển
          </Typography>
        </Box>

        {/* MAIN GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "400px 1fr",
            },
            gap: 2,
          }}
        >

          {/* LEFT BANNER */}
          <Box
            component="img"
            src={deal1}
            alt="deal banner"
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 2,
              objectFit: "cover",
            }}
          />

          {/* DEAL ITEMS */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 2,
            }}
          >
            {deals.map((item, index) => (
              <Box
                key={index}
                sx={{
                  background: "#fff",
                  borderRadius: 2,
                  textAlign: "center",
                  p: 2,
                  cursor: "pointer",
                  transition: "0.25s",
                  border: "1px solid #eee",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.img}
                  alt={item.name}
                  sx={{
                    width: "100%",
                    height: 100,
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
            ))}
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default Deal;