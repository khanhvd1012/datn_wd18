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

// Images
import mainBanner4 from "../img/ac166ae798c54cb4a000c21118458dc0.webp";
import mainBanner6 from "../img/a93517d958abd6f58fba.jpg";
import mainBanner7 from "../img/5f096f672215ac4bf504.jpg";
import mainBanner9 from "../img/bl2.jpg";
import mainBanner10 from "../img/bl3.jpg";

// ===== DATA =====
const categories = [
  {
    name: "Phụ kiện iPhone",
    children: [
      "Ốp lưng iPhone",
      "Cáp sạc Lightning",
      "Sạc nhanh",
      "Kính cường lực",
      "Pin dự phòng"
    ]
  },
  {
    name: "Phụ kiện Samsung",
    children: [
      "Ốp lưng Samsung",
      "Cáp Type-C",
      "Sạc không dây",
      "Kính cường lực"
    ]
  },
  {
    name: "Phụ kiện Xiaomi",
    children: [
      "Ốp lưng Xiaomi",
      "Cáp sạc",
      "Pin dự phòng"
    ]
  },
  {
    name: "Tai nghe Bluetooth",
    children: [
      "True Wireless",
      "Tai nghe chụp tai",
      "Tai nghe thể thao"
    ]
  },
  {
    name: "Đồng hồ thông minh",
    children: [
      "Apple Watch",
      "Samsung Watch",
      "Xiaomi Watch"
    ]
  }
];

const banners = [mainBanner4, mainBanner9, mainBanner10];

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);

  // Auto slide
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
    <Box sx={{ background: "#26262e", borderBottom: "1px solid #c5ba9d", py: 2 }}>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>

        {/* ===== SIDEBAR ===== */}
        <Box sx={{ width: 250, backgroundColor: "#101011", color: "#fff", position: "relative" }}>
          <Box sx={{ backgroundColor: "#ff9800", p: 1.5, fontWeight: "bold" }}>
            DANH MỤC SẢN PHẨM
          </Box>

          <List>
            {categories.map((item, i) => (
              <Box
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                sx={{ position: "relative" }}
              >
                <ListItemButton
                  sx={{
                    "&:hover": { backgroundColor: "#1f1f1f" }
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItemButton>

                {/* SUB MENU */}
                {hoverIndex === i && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "100%",
                      width: 260,
                      backgroundColor: "#fff",
                      color: "#000",
                      boxShadow: 4,
                      p: 2,
                      zIndex: 20
                    }}
                  >
                    {item.children.map((child, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          py: 1,
                          px: 1,
                          cursor: "pointer",
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                            color: "#ff6b35"
                          }
                        }}
                      >
                        {child}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </List>
        </Box>

        {/* ===== MAIN BANNER ===== */}
        <Box
          sx={{
            width: 700,
            height: 400,
            overflow: "hidden",
            position: "relative",
            borderRadius: 2,
            backgroundColor: "#000"
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
                  width: 700,
                  height: 400,
                  objectFit: "cover",
                  flexShrink: 0
                }}
              />
            ))}
          </Box>

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

        {/* ===== RIGHT BANNERS ===== */}
        <Box sx={{ width: 260, display: "flex", flexDirection: "column", gap: 2 }}>
          <img
            src={mainBanner7}
            style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 6 }}
          />
          <img
            src={mainBanner6}
            style={{ width: "100%", height: 190, objectFit: "cover", borderRadius: 6 }}
          />
        </Box>

      </Box>
    </Box>
  );
};

export default Banner;
