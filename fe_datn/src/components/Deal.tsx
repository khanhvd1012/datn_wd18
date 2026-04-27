import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DealMallBanner from "./DealMallBanner";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100%25' height='100%25' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='%23999' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";

const Deal = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<
    { _id: string; name: string; image?: string; logo_image?: string }[]
  >([]);

  const [banners, setBanners] = useState<
    { _id: string; image: string; status?: boolean }[]
  >([]);

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

  const goCategory = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  const getImage = (item: any) => {
    return item.logo_image || item.image || FALLBACK_IMAGE;
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
          {/* BANNER */}
          <DealMallBanner banners={banners} />

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
                      e.target.src = FALLBACK_IMAGE;
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