import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import mainBanner4 from "../img/ac166ae798c54cb4a000c21118458dc0.webp";
import mainBanner6 from "../img/a93517d958abd6f58fba.jpg";
import mainBanner7 from "../img/5f096f672215ac4bf504.jpg";
import mainBanner9 from "../img/bl2.jpg";
import mainBanner10 from "../img/bl3.jpg";

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
    children: ["Ốp lưng Xiaomi", "Cáp sạc", "Pin dự phòng"]
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
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ background: "#f5f5f7", py: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: 1200,
          mx: "auto"
        }}
      >
        {/* ================= SIDEBAR ================= */}
        <Box
          sx={{
            width: 250,
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              bgcolor: "#d70018",
              color: "#fff",
              p: 1.8,
              fontWeight: 600,
              fontSize: 14
            }}
          >
            DANH MỤC SẢN PHẨM
          </Box>

          <List sx={{ py: 0 }}>
            {categories.map((item, i) => (
              <Box
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                sx={{ position: "relative" }}
              >
                {/* DANH MỤC CHA */}
                <ListItemButton
                  onClick={() =>
                    navigate(
                      `/products?category=${encodeURIComponent(item.name)}`
                    )
                  }
                  sx={{
                    py: 1.3,
                    px: 2,
                    fontSize: 14,
                    "&:hover": {
                      bgcolor: "#fff0f1",
                      color: "#d70018"
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography fontSize={14}>
                        {item.name}
                      </Typography>
                    }
                  />
                </ListItemButton>

                {/* DANH MỤC CON */}
                {hoverIndex === i && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "100%",
                      width: 240,
                      bgcolor: "#fff",
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      p: 1.5,
                      zIndex: 20
                    }}
                  >
                    {item.children.map((child, idx) => (
                      <Box
                        key={idx}
                        onClick={() =>
                          navigate(
                            `/products?category=${encodeURIComponent(
                              item.name
                            )}&sub=${encodeURIComponent(child)}`
                          )
                        }
                        sx={{
                          py: 0.8,
                          px: 1,
                          borderRadius: 1,
                          fontSize: 13,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "#fff0f1",
                            color: "#d70018"
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

        {/* ================= MAIN SLIDER ================= */}
        <Box
          sx={{
            flex: 1,
            height: 400,
            borderRadius: 2,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: `${banners.length * 100}%`,
              transform: `translateX(-${index * (100 / banners.length)}%)`,
              transition: "transform 0.6s ease"
            }}
          >
            {banners.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                sx={{
                  width: `${100 / banners.length}%`,
                  height: 400,
                  objectFit: "cover"
                }}
              />
            ))}
          </Box>

          <IconButton
            onClick={() =>
              setIndex(index === 0 ? banners.length - 1 : index - 1)
            }
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              bgcolor: "#ffffffcc",
              "&:hover": { bgcolor: "#fff" }
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={() =>
              setIndex((index + 1) % banners.length)
            }
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              bgcolor: "#ffffffcc",
              "&:hover": { bgcolor: "#fff" }
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1
            }}
          >
            {banners.map((_, i) => (
              <Box
                key={i}
                onClick={() => setIndex(i)}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: index === i ? "#d70018" : "#ddd",
                  cursor: "pointer"
                }}
              />
            ))}
          </Box>
        </Box>

        {/* ================= MINI BANNER ================= */}
        <Box
          sx={{
            width: 250,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 2
          }}
        >
          {[mainBanner7, mainBanner6].map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              sx={{
                height: 190,
                borderRadius: 2,
                objectFit: "cover",
                transition: "0.3s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:hover": {
                  transform: "scale(1.03)"
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Banner;