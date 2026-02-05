import { 
  Box, 
  List, 
  ListItemButton, 
  ListItemText, 
  IconButton,
  Link
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
  {
    title: "Phụ kiện Iphone",
    children: ["Iphone XS", "Iphone 11", "Iphone 12", "Iphone 14", "Iphone 15"]
  },
  {
    title: "Phụ kiện Samsung",
    children: ["Samsung s22", "Samsung s23", "Samsung s24"]
  },
  {
    title: "Phụ kiện Huawei",
    children: ["Huawei 3", "Huawei 4"]
  },
  {
    title: "Phụ kiện Xiaomi",
    children: ["Xiaomi 10", "Xiaomi 12", "Xiaomi 13"]
  },
  {
    title: "Phụ kiện Oppo",
    children: ["Oppo A5", "Oppo A7", "Oppo A9"]
  },
  {
    title: "Tai nghe Bluetooth",
    children: ["AirPods", "Sony", "JBL"]
  },
  {
    title: "Đồng hồ thông minh",
    children: ["Apple Watch", "Samsung Watch", "Xiaomi Watch"]
  }
];


const banners = [mainBanner4, mainBanner9, mainBanner10];

const Banner = () => {
  const [index, setIndex] = useState(0);

  //  Auto slide
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
        <Box
          sx={{
            width: 250,
            backgroundColor: "#101011",
            color: "#fff",
            position: "relative"
          }}
        >
          <Box sx={{ backgroundColor: "#ff9800", p: 1, fontWeight: "bold" }}>
            DANH MỤC SẢN PHẨM
          </Box>

          <List sx={{ p: 0 }}>
            {categories.map((cat, idx) => (
              <Box
                key={idx}
                sx={{
                  position: "relative",
                  "&:hover .submenu": {
                    display: "block"
                  }
                }}
              >
                {/* Menuchaa */}
                <ListItemButton
                  component={Link}
                  href="#"
                  sx={{
                    borderBottom: "1px solid #1e1e1e",
                    textDecoration: "none",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#1c1c1c" }
                  }}
                >
                  <ListItemText primary={cat.title} />
                </ListItemButton>

                {/* Sub mmenu */}
                <Box
                  className="submenu"
                  sx={{
                    display: "none",
                    position: "absolute",
                    top: 0,
                    left: "100%",
                    width: 300,
                    borderRadius: 1.6,
                    backgroundColor: "#1b1b1b",
                    boxShadow: "0 0 10px rgba(0,0,0,0.6)",
                    zIndex: 10
                  }}
                >
                  {cat.children.map((item, i) => (
                    <Box
                      key={i}
                      component={Link}
                      href="#"
                      sx={{
                        display: "block",
                        px: 2,
                        py: 1,
                        textDecoration: "none",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#ff9800",
                          color: "#000",
                          borderRadius: "4px"
                        }
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </List>
        </Box>


        {/* Main banner slider */}
        <Box
          sx={{
            width: "700px",
            overflow: "hidden",
            borderRadius: 2, 
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
