import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
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

// Dữ liệu sẽ được fetch từ API

const Banner = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [apiCategories, setApiCategories] = useState<
    { name: string; _id: string }[]
  >([]);
  const [apiBanners, setApiBanners] = useState<
    { image: string; title: string; _id: string }[]
  >([]);

  // Index trên "slide ảo" (đã gồm clone 2 đầu). Slide thật số i tương ứng index = i + 1.
  const realCount = apiBanners.length;
  const [index, setIndex] = useState(1);
  const [enableTransition, setEnableTransition] = useState(true);

  // Danh sách slide hiển thị: [clone(last), ...banners, clone(first)]
  const displaySlides =
    realCount > 0
      ? [apiBanners[realCount - 1], ...apiBanners, apiBanners[0]]
      : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, banRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch("http://localhost:3000/api/banners"),
        ]);
        const cats = await catRes.json();
        const bans = await banRes.json();

        setApiCategories(Array.isArray(cats) ? cats : []);
        // Lọc banner đang hoạt động
        setApiBanners(
          Array.isArray(bans)
            ? bans.filter((b: any) => b.status !== false)
            : [],
        );
      } catch (err) {
        console.error("Lỗi load banner/categories:", err);
      }
    };
    fetchData();
  }, []);

  // Reset vị trí về slide thật đầu tiên mỗi khi data load xong
  useEffect(() => {
    if (realCount > 0) {
      setEnableTransition(false);
      setIndex(1);
    }
  }, [realCount]);

  // Auto-slide mỗi 2 giây
  useEffect(() => {
    if (hover || realCount === 0) return;

    const timer = setInterval(() => {
      setEnableTransition(true);
      setIndex((prev) => prev + 1);
    }, 2000);

    return () => clearInterval(timer);
  }, [hover, realCount]);

  // Khi lướt tới clone, snap ngầm về slide thật tương ứng (mắt không thấy).
  useEffect(() => {
    if (realCount === 0) return;

    if (index === realCount + 1) {
      // Đang đứng ở clone(first) ở cuối → chờ animation xong rồi nhảy về slide thật đầu tiên
      const t = setTimeout(() => {
        setEnableTransition(false);
        setIndex(1);
      }, 600);
      return () => clearTimeout(t);
    }

    if (index === 0) {
      // Đang đứng ở clone(last) ở đầu → nhảy ngầm về slide thật cuối cùng
      const t = setTimeout(() => {
        setEnableTransition(false);
        setIndex(realCount);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [index, realCount]);

  // Sau khi snap không transition, bật lại transition cho lần kế tiếp
  useEffect(() => {
    if (!enableTransition) {
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEnableTransition(true));
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [enableTransition]);

  const next = () => {
    if (realCount === 0) return;
    setEnableTransition(true);
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (realCount === 0) return;
    setEnableTransition(true);
    setIndex((prev) => prev - 1);
  };

  const goCategory = (id: string) => {
    navigate(`/products?category=${id}`);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        {/* SIDEBAR */}

        <Box
          sx={{
            width: 230,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              bgcolor: "#1976d2", // Changed to blue for phone accessories theme
              color: "#fff",
              fontWeight: 700,
              p: 1.5,
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          >
            PHỤ KIỆN ĐIỆN THOẠI
          </Box>

          <List sx={{ p: 0 }}>
            {apiCategories.map((item, i) => (
              <ListItemButton
                key={i}
                onClick={() => goCategory(item._id)}
                sx={{
                  borderBottom: "1px solid #f1f1f1",
                  transition: "0.25s",

                  "&:hover": {
                    background: "#e3f2fd", // Light blue hover
                    pl: 3,
                  },
                }}
              >
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>

        {/* MAIN SLIDER */}

        <Box
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            flex: 1,
            height: 380,
            borderRadius: 3,
            overflow: "hidden",
            position: "relative",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              height: "100%",
              transform: `translateX(-${index * 100}%)`,
              transition: enableTransition ? "transform 0.6s ease" : "none",
            }}
          >
            {realCount > 0 ? (
              displaySlides.map((banner, i) => (
                <Box
                  key={`${banner._id}-${i}`}
                  component="img"
                  src={banner.image}
                  sx={{
                    flex: "0 0 100%",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ))
            ) : (
              <Box
                component="img"
                src={mainBanner4}
                sx={{
                  flex: "0 0 100%",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Box>

          <IconButton
            onClick={prev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 10,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.4)",
              color: "#fff",
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
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>

        {/* RIGHT ADS

        <Box
          sx={{
            width:250,
            display:"flex",
            flexDirection:"column",
            gap:2
          }}
        >

          <Box
            component="img"
            src={mainBanner7}
            sx={{
              width:"100%",
              height:180,
              borderRadius:3,
              objectFit:"cover",
              transition:"0.3s",

              "&:hover":{
                transform:"scale(1.05)"
              }
            }}
          />

          <Box
            component="img"
            src={mainBanner6}
            sx={{
              width:"100%",
              height:180,
              borderRadius:3,
              objectFit:"cover",
              transition:"0.3s",

              "&:hover":{
                transform:"scale(1.05)"
              }
            }}
          /> */}

        {/* </Box> */}
      </Box>
    </Box>
  );
};

export default Banner;
