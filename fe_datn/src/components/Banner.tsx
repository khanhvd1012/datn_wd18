import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useState, useEffect } from "react";

import mainBanner4 from "../img/ban-phu-kien-dien-thoai-co-lai-khong.jpg";

const Banner = () => {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  const [apiBanners, setApiBanners] = useState<
    { image: string; title: string; _id: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/banners");
        const data = await res.json();

        setApiBanners(
          Array.isArray(data)
            ? data.filter((b: any) => b.status !== false)
            : [],
        );
      } catch (err) {
        console.error("Lỗi load banners:", err);
      }
    };

    fetchData();
  }, []);

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
    setIndex((prev) => (prev === 0 ? apiBanners.length - 1 : prev - 1));
  };

  const slides =
    apiBanners.length > 0
      ? apiBanners
      : [{ image: mainBanner4, _id: "fallback", title: "" }];

  const slideCount = slides.length;

  return (
    <Box
      sx={{
        mt: 3,
        px: 2,
        width: "100%",
        maxWidth: 1300,
        mx: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Viewport: chiều cao theo tỉ lệ, không scale tùy ý theo viewport full-width */}
      <Box
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          width: "100%",
          aspectRatio: { xs: "16 / 10", sm: "16 / 8", md: "16 / 6" },
          minHeight: { xs: 200, sm: 260, md: 320 },
          maxHeight: { xs: 320, sm: 400, md: 480 },
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          bgcolor: "#000",
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: `${slideCount * 100}%`,
            transform:
              slideCount > 0
                ? `translateX(-${(index * 100) / slideCount}%)`
                : "none",
            transition: "transform 0.6s ease",
          }}
        >
          {slides.map((banner, i) => (
            <Box
              key={banner._id || i}
              sx={{
                flex: `0 0 ${100 / slideCount}%`,
                width: `${100 / slideCount}%`,
                height: "100%",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={banner.image}
                alt={banner.title || "banner"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </Box>
          ))}
        </Box>

        {/* NAV BUTTONS */}
        {apiBanners.length > 1 && (
          <>
            <IconButton
              onClick={prev}
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

            <IconButton
              onClick={next}
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
          </>
        )}
      </Box>
    </Box>
  );
};

export default Banner;