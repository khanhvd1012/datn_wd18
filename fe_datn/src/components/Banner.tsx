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

const Banner = () => {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  const [apiCategories, setApiCategories] = useState<
    { name: string; _id: string }[]
  >([]);

  const [apiBanners, setApiBanners] = useState<
    { image: string; title: string; _id: string }[]
  >([]);

  // Fetch API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch("http://localhost:3000/api/banners")
        ]);

        const cats = await catRes.json();
        const bans = await banRes.json();

        setApiCategories(Array.isArray(cats) ? cats : []);
        setApiBanners(
          Array.isArray(bans) ? bans.filter((b: any) => b.status !== false) : []
        );
      } catch (err) {
        console.error("Lỗi load banner/categories:", err);
      }
    };

    fetchData();
  }, []);

  // Auto slider
  useEffect(() => {
    if (hover || apiBanners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % apiBanners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [hover, apiBanners.length]);

  const next = () => {
    if (apiBanners.length === 0) return;
    setIndex((prev) => (prev + 1) % apiBanners.length);
  };

  const prev = () => {
    if (apiBanners.length === 0) return;
    setIndex((prev) =>
      prev === 0 ? apiBanners.length - 1 : prev - 1
    );
  };

  const goCategory = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: 1200,
          mx: "auto"
        }}
      >

        {/* SIDEBAR */}
        <Box
          sx={{
            width: 250,
            height: "388px",
            borderBottomRightRadius: 5
          }}
        >
          <Box
            sx={{
              backgroundColor: "#ff9800",
              p: 1,
              fontWeight: "bold"
            }}
          >
            DANH MỤC SẢN PHẨM
          </Box>

          <List>
            {apiCategories.map((item) => (
              <ListItemButton
                key={item._id}
                onClick={() => goCategory(item._id)}
              >
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* MAIN SLIDER */}
        <Box
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
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
              width: `${(apiBanners.length || 1) * 100}%`,
              transform: `translateX(-${index * 100}%)`,
              transition: "0.6s"
            }}
          >
            {apiBanners.map((banner) => (
              <Box
                key={banner._id}
                component="img"
                src={banner.image}
                sx={{
                  width: "100%",
                  height: 380,
                  objectFit: "cover"
                }}
              />
            ))}

            {apiBanners.length === 0 && (
              <Box
                component="img"
                src={mainBanner4}
                sx={{
                  width: "100%",
                  height: 380,
                  objectFit: "cover"
                }}
              />
            )}
          </Box>

          {/* Prev */}
          <IconButton
            onClick={prev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.4)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>

          {/* Next */}
          <IconButton
            onClick={next}
            sx={{
              position: "absolute",
              top: "50%",
              right: 10,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.4)",
              color: "#fff",
              "&:hover": { bgcolor: "rgba(0,0,0,0.6)" }
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* RIGHT ADS */}
        <Box
          sx={{
            width: 260,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Box
            component="img"
            src={mainBanner7}
            sx={{
              width: "100%",
              height: "178px",
              objectFit: "cover",
              borderRadius: 2,
              animation: "floatY 4s ease-in-out infinite"
            }}
          />

          <Box
            component="img"
            src={mainBanner6}
            sx={{
              width: "100%",
              height: "187px",
              objectFit: "cover",
              borderRadius: 2,
              animation: "floatY 4s ease-in-out infinite 1.5s"
            }}
          />
        </Box>
      </Box>

      <style>
        {`
        @keyframes floatY {
          0% { transform: translateY(0); }
          25% { transform: translateY(0px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(6px); }
          100% { transform: translateY(0); }
        }
        `}
      </style>
    </Box>
  );
};

export default Banner;