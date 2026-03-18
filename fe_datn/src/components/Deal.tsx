<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
=======
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
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa

const Deal = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<
    { _id: string; name: string; image?: string; logo_image?: string }[]
  >([]);

  const [banners, setBanners] = useState<
    { _id: string; image: string; status?: boolean }[]
  >([]);

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  // 👉 FETCH GIỐNG BANNER
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch("http://localhost:3000/api/banners"),
        ]);

        const cats = await catRes.json();
        const bans = await banRes.json();

        setCategories(Array.isArray(cats) ? cats : []);
        setBanners(
          Array.isArray(bans) ? bans.filter((b: any) => b.status !== false) : []
        );
      } catch (err) {
        console.error("Lỗi load deal:", err);
      }
    };

    fetchData();
  }, []);

  // 👉 AUTO SLIDER
  useEffect(() => {
    if (hover || banners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [hover, banners]);

  // 👉 FIX index khi data đổi
  useEffect(() => {
    if (index >= banners.length) setIndex(0);
  }, [banners]);

  const next = () => {
    if (banners.length === 0) return;
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    if (banners.length === 0) return;
    setIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  const goCategory = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  const getImage = (item: any) => {
    return (
      item.logo_image ||
      item.image ||
      "https://via.placeholder.com/100"
    );
  };

  return (
<<<<<<< HEAD
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
          <Typography sx={{ color: "#ee4d2d", fontWeight: 700, fontSize: 22 }}>
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
          {/* 🔥 LEFT BANNER SLIDER */}
          <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            sx={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: 2,
              position: "relative",
              background: "#000",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: `${(banners.length || 1) * 100}%`,
                transform: `translateX(-${index * 100}%)`,
                transition: "0.5s",
              }}
            >
              {banners.length > 0 ? (
                banners.map((item) => (
                  <Box
                    key={item._id}
                    component="img"
                    src={item.image}
                    sx={{
                      width: "100%",
                      height: 300,
                      objectFit: "cover",
                    }}
                  />
                ))
              ) : (
                <Box
                  component="img"
                  src="https://via.placeholder.com/400"
                  sx={{ width: "100%", height: 300 }}
                />
              )}
            </Box>
          </Box>
          {/* CATEGORY GRID */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 2,
            }}
          >
            {categories.length > 0 ? (
              categories.slice(0, 6).map((item) => (
                <Box
                  key={item._id}
                  onClick={() => goCategory(item._id)}
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
                    src={getImage(item)}
                    onError={(e: any) => {
                      e.target.src = "https://via.placeholder.com/100";
                    }}
                    sx={{
                      width: "100%",
                      height: 90,
                      objectFit: "contain",
                      mb: 1,
                    }}
                  />

                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>Không có danh mục</Typography>
            )}
          </Box>
        </Box>
=======
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
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
      </Box>
    </Box>
  );
};

export default Deal;