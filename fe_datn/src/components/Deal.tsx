import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";

import deal1 from "../img/deal_1.jpg";
import deal2 from "../img/deal_cap_sac.webp";
import deal3 from "../img/deal_de sac_k_day.webp";
import deal4 from "../img/deal_gia_do_chong_xoay.webp";
import deal5 from "../img/deal_gia_do_ipa.webp";
import deal6 from "../img/deal_pin_du_phong.webp";
import deal7 from "../img/deal_tainghe.webp";

const deals = [
  { img: deal2, name: "Cáp sạc nhanh", link: "/product/1" },
  { img: deal3, name: "Đế sạc không dây", link: "/product/2" },
  { img: deal4, name: "Giá đỡ chống xoay", link: "/product/3" },
  { img: deal5, name: "Giá đỡ iPad", link: "/product/4" },
  { img: deal6, name: "Pin dự phòng", link: "/product/5" },
  { img: deal7, name: "Tai nghe Bluetooth", link: "/product/6" },
];

const Deal = () => {
  return (
    <Box
      sx={{
        background: "#f3f4f6",
        py: 8,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* CONTAINER */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          px: 2,
        }}
      >
        {/* HEADER */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 800,
              color: "#ee4d2d",
            }}
          >
            ⚡ FLASH SALE
          </Typography>

          <Typography sx={{ color: "#666", fontSize: 14 }}>
            Săn deal giá tốt mỗi ngày
          </Typography>
        </Box>

        {/* CONTENT CENTER */}
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
        >
          {/* BANNER */}
          <Grid item xs={12} md={5}>
            <Box
              component={Link}
              to="/sale"
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                height: "100%",
              }}
            >
              <Box
                component="img"
                src={deal1}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  left: 20,
                  bottom: 20,
                  color: "#fff",
                }}
              >
                <Typography fontSize={22} fontWeight="bold">
                  Deal cực sốc
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* DEAL GRID */}
          <Grid item xs={12} md={7}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
            >
              {deals.map((item, index) => (
                <Grid item xs={6} sm={4} key={index}>
                  <Box
                    component={Link}
                    to={item.link}
                    sx={{
                      textDecoration: "none",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 180,
                        background: "#fff",
                        borderRadius: 3,
                        p: 2,
                        textAlign: "center",
                        transition: "0.25s",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      {/* badge */}
                      <Box
                        sx={{
                          background: "#ee4d2d",
                          color: "#fff",
                          fontSize: 11,
                          px: 1,
                          borderRadius: 1,
                          display: "inline-block",
                          mb: 1,
                        }}
                      >
                        HOT
                      </Box>

                      {/* image */}
                      <Box
                        component="img"
                        src={item.img}
                        sx={{
                          width: "100%",
                          height: 100,
                          objectFit: "contain",
                          mb: 1,
                        }}
                      />

                      {/* name */}
                      <Typography fontSize={13} color="#333">
                        {item.name}
                      </Typography>
                    </Box>
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