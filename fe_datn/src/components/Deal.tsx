
import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";


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
                width: "100%",
                height: "100%",
                transform: `translateX(-${index * 100}%)`,
                transition: "transform 0.5s ease",
              }}
            >
              {banners.length > 0 ? (
                banners.map((item) => (
                  <Box
                    key={item._id}
                    component="img"
                    src={item.image}
                    sx={{
                      flex: "0 0 100%",
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
                  sx={{
                    flex: "0 0 100%",
                    width: "100%",
                    height: 300,
                    objectFit: "cover",
                  }}
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

      </Box>
    </Box>
  );
};

export default Deal;