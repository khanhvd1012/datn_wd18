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

import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import AndroidIcon from "@mui/icons-material/Android";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import WatchIcon from "@mui/icons-material/Watch";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 👉 IMPORT ẢNH
import banner1 from "../img/ac166ae798c54cb4a000c21118458dc0.webp";
import banner2 from "../img/bl2.jpg";
import banner3 from "../img/bl3.jpg";

import ad1 from "../img/5f096f672215ac4bf504.jpg";
import ad2 from "../img/a93517d958abd6f58fba.jpg";

// 👉 DANH MỤC
const categories = [
  { name: "Phụ kiện iPhone", slug: "iphone", icon: <PhoneIphoneIcon fontSize="small" /> },
  { name: "Phụ kiện Samsung", slug: "samsung", icon: <AndroidIcon fontSize="small" /> },
  { name: "Phụ kiện Xiaomi", slug: "xiaomi" },
  { name: "Tai nghe Bluetooth", slug: "tainghe", icon: <HeadphonesIcon fontSize="small" /> },
  { name: "Đồng hồ thông minh", slug: "dongho", icon: <WatchIcon fontSize="small" /> }
];

// 👉 BANNER
const banners = [
  { img: banner1, title: "Phụ kiện xịn giá sốc 🔥" },
  { img: banner2, title: "Sale cực mạnh hôm nay 💥" },
  { img: banner3, title: "Mua là có quà 🎁" }
];

const rightAds = [ad1, ad2];

const Banner = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (hover) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [hover]);

  const next = () => setIndex((prev) => (prev + 1) % banners.length);
  const prev = () =>
    setIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  return (
    <Box sx={{ bgcolor: "#f5f5f7", py: 4 }}>
      <Box sx={{ display: "flex", gap: 2, maxWidth: 1200, mx: "auto" }}>

        {/* SIDEBAR */}
        <Box sx={{ width: 240, bgcolor: "#fff", borderRadius: 3 }}>
          <Box
            sx={{
              bgcolor: "#ee4d2d",
              color: "#fff",
              p: 1.5,
              textAlign: "center",
              fontWeight: 700
            }}
          >
            DANH MỤC
          </Box>

          <List sx={{ p: 0 }}>
            {categories.map((item, i) => (
              <ListItemButton
                key={i}
                onClick={() => navigate(`/products?category=${item.slug}`)}
                sx={{
                  borderBottom: "1px solid #f5f5f5",
                  "&:hover": { background: "#fff1f0", pl: 3 }
                }}
              >
                {item.icon}
                <ListItemText primary={item.name} sx={{ ml: 1 }} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* SLIDER */}
        <Box
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            flex: 1,
            height: 400,
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
          }}
        >
          {/* SLIDE */}
          <Box
            sx={{
              display: "flex",
              width: `${banners.length * 100}%`,
              transform: `translateX(-${index * (100 / banners.length)}%)`,
              transition: "0.6s"
            }}
          >
            {banners.map((item, i) => (
              <Box key={i} sx={{ width: `${100 / banners.length}%`, position: "relative" }}>

                {/* 🔥 FIX KHÔNG CẮT ẢNH */}
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* blur nền */}
                  <Box
                    component="img"
                    src={item.img}
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "blur(30px)",
                      transform: "scale(1.2)"
                    }}
                  />

                  {/* ảnh chính */}
                  <Box
                    component="img"
                    src={item.img}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      zIndex: 2
                    }}
                  />
                </Box>

                {/* overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, rgba(0,0,0,0.4), transparent)"
                  }}
                />

                {/* text */}
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: 30,
                    left: 30,
                    color: "#fff",
                    fontSize: 28,
                    fontWeight: 800,
                    opacity: index === i ? 1 : 0,
                    transform: index === i ? "translateY(0)" : "translateY(40px)",
                    transition: "0.5s"
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* arrows */}
          <IconButton
            onClick={prev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              bgcolor: "#fff",
              opacity: hover ? 1 : 0
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          <IconButton
            onClick={next}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              bgcolor: "#fff",
              opacity: hover ? 1 : 0
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>

          {/* dots */}
          <Box
            sx={{
              position: "absolute",
              bottom: 15,
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
                  width: index === i ? 18 : 8,
                  height: 8,
                  borderRadius: 5,
                  bgcolor: index === i ? "#ee4d2d" : "#fff",
                  cursor: "pointer"
                }}
              />
            ))}
          </Box>
        </Box>

        {/* ADS */}
        <Box sx={{ width: 250, display: "flex", flexDirection: "column", gap: 2 }}>
          {rightAds.map((img, i) => (
            <Box
              key={i}
              component="img"
              src={img}
              sx={{
                width: "100%",
                height: 190,
                borderRadius: 3,
                objectFit: "cover",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.05)" }
              }}
            />
          ))}
        </Box>

      </Box>
    </Box>
  );
};

export default Banner;