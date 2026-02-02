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

import mainBanner0 from "../img/vi-vn-iphone-16-pro-1.jpg";
import mainBanner1 from "../img/dien-thoai-iphone-16-pro-1.webp";
import mainBanner2 from "../img/ban-phu-kien-dien-thoai-co-lai-khong.jpg";
import mainBanner3 from "../img/mau-content-phu-kien-dien-thoai-4.png";
import mainBanner4 from "../img/ac166ae798c54cb4a000c21118458dc0.webp";
import mainBanner5 from "../img/black.jpg";
import mainBanner6 from "../img/a93517d958abd6f58fba.jpg";
import mainBanner7 from "../img/5f096f672215ac4bf504.jpg";
import mainBanner8 from "../img/bl1.jpeg";
import mainBanner9 from "../img/bl2.jpg";
import mainBanner10 from "../img/bl3.jpg";

const categories = [
  "Phụ kiện Iphone",
  "Phụ kiện Samsung",
  "Phụ kiện Huawei",
  "Phụ kiện Xiaomi",
  "Phụ kiện Oppo",
  "Tai nghe Bluetooth",
  "Đồng hồ thông minh"
];

const banners = [mainBanner4, mainBanner9, mainBanner10];

const Banner = () => {
  const [index, setIndex] = useState(0);

  // 👉 Auto slide
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

  return (
    <div style={{ background: "#26262e", borderBottom: "1px solid #c5ba9d" }}>
      <Box sx={{ display: "flex", mt: 2, gap: 2 }}>

        {/* Sidebar */}
        <Box sx={{ width: 250, backgroundColor: "#101011", color: "#fff" }}>
          <Box sx={{ backgroundColor: "#ff9800", p: 1, fontWeight: "bold" }}>
            DANH MỤC SẢN PHẨM
          </Box>
          <List>
            {categories.map((item, index) => (
              <ListItemButton key={index}>
                <ListItemText primary={item} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* Main banner slider */}
        <Box
          sx={{
            width: "700px",
            overflow: "hidden",
            borderRadius: 2, // bo tròn nhẹ
            position: "relative",
            backgroundColor: "#000",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: `${banners.length * 700}px`,
              transform: `translateX(-${index * 700}px)`,
              transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
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
                  objectFit: "contain",
                  flexShrink: 0,
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
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
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
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
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
                borderRadius: 6,
                animation: "floatY 4s ease-in-out infinite",
                }}
            />
            <img
                src={mainBanner6}
                style={{
                width: "100%",
                height: "190px",
                objectFit: "cover",
                borderRadius: 6,
                animation: "floatY 4s ease-in-out infinite 1.5s",
                }}
            />
        </Box>


      </Box>

      {/* Animation */}
      <style>
        {`
        @keyframes floatY {
            0% { transform: translateY(0); }
            25% { transform: translateY(0px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(4px); }
            100% { transform: translateY(0); }
        }
        `}
        </style>

    </div>
  );
};

export default Banner;
