import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import mainBanner4 from "../img/ban-phu-kien-dien-thoai-co-lai-khong.jpg";
import mainBanner6 from "../img/a93517d958abd6f58fba.jpg";
import mainBanner7 from "../img/5f096f672215ac4bf504.jpg";
import mainBanner9 from "../img/bl2.jpg";
import mainBanner10 from "../img/bl3.jpg";

const categories = [
  { name: "Phụ kiện Iphone", slug: "iphone" },
  { name: "Phụ kiện Samsung", slug: "samsung" },
  { name: "Phụ kiện Huawei", slug: "huawei" },
  { name: "Phụ kiện Xiaomi", slug: "xiaomi" },
  { name: "Phụ kiện Oppo", slug: "oppo" },
  { name: "Tai nghe Bluetooth", slug: "tainghe" },
  { name: "Đồng hồ thông minh", slug: "dongho" }
];

const banners = [mainBanner4, mainBanner10, mainBanner9];

const Banner = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleCategoryClick = (slug: string) => {
    navigate(`/products?category=${slug}`);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>

        {/* Sidebar */}
        <Box sx={{ width: 250, height: 388, borderBottomRightRadius: 5 }}>
          
          <Box
            sx={{
              backgroundColor: "#ff9800",
              p: 1,
              fontWeight: "bold",
              color: "#fff"
            }}
          >
            DANH MỤC SẢN PHẨM
          </Box>

          <List>
            {categories.map((item, index) => (
              <ListItemButton
                key={index}
                onClick={() => handleCategoryClick(item.slug)}
                sx={{
                  "&:hover .MuiTypography-root": {
                    color: "#ff9800"
                  }
                }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    color: "#555",
                    fontSize: 14,
                    fontWeight: 500
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Banner slider */}
        <Box
          sx={{
            width: "700px",
            height: "385px",
            overflow: "hidden",
            borderRadius: 2,
            position: "relative",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center"
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: `${banners.length * 700}px`,
              transform: `translateX(-${index * 700}px)`,
              transition: "transform 0.8s ease"
            }}
          >
            {banners.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                alt={`banner-${i}`}
                sx={{
                  width: "700px",
                  height: "400px",
                  objectFit: "cover",
                  flexShrink: 0
                }}
              />
            ))}
          </Box>

          {/* Prev */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.4)",
              color: "#fff"
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Next */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.4)",
              color: "#fff"
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* Right banners */}
        <Box sx={{ width: 260, display: "flex", flexDirection: "column", gap: 2 }}>
          
          <img
            src={mainBanner7}
            style={{
              width: "100%",
              height: "178px",
              objectFit: "cover",
              borderRadius: 6
            }}
          />

          <img
            src={mainBanner6}
            style={{
              width: "100%",
              height: "187px",
              objectFit: "cover",
              borderRadius: 6
            }}
          />

        </Box>

      </Box>
    </Box>
  );
};

export default Banner;