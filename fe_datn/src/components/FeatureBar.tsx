import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import hangquocte from "../img/FeatureBar_hangquocte.webp";
import shop from "../img/FeatureBar_shopxuly.webp";
import deal from "../img/FeatureBar_dealhot.webp";
import style from "../img/FeatureBar_hangquocte.webp";
import khachhang from "../img/FeatureBar_khachhang.webp";
import magiamgia from "../img/FeatureBar_magiamgia.webp";

const features = [
  { img: hangquocte, text: "Hàng Quốc Tế", link: "/category/quoc-te" },
  { img: shop, text: "Shop Xử Lý", link: "/shop" },
  { img: deal, text: "Deal Hot\nGiờ Vàng", link: "/deal" },
  { img: style, text: "Shop Style\nVoucher 30%", link: "/style" },
  { img: khachhang, text: "Khách Hàng\nThân Thiết", link: "/vip" },
  { img: magiamgia, text: "Mã Giảm Giá", link: "/voucher" }
];

const FeatureBar = () => {
  return (
    <Box
      sx={{
        py: 4,
        background: "linear-gradient(180deg, #fff, #f5f5f5)"
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 2,

          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(6, 110px)",
            sm: "repeat(3,1fr)",
            md: "repeat(6,1fr)"
          },
          gap: 3,

          overflowX: { xs: "auto", md: "unset" },
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        {features.map((item, index) => (
          <Box
            key={index}
            component={Link}
            to={item.link}
            sx={{
              textAlign: "center",
              textDecoration: "none",
              position: "relative",

              opacity: 0,
              transform: "translateY(30px)",
              animation: `fadeUp 0.6s ease forwards`,
              animationDelay: `${index * 0.1}s`,

              "@keyframes fadeUp": {
                to: {
                  opacity: 1,
                  transform: "translateY(0)"
                }
              }
            }}
          >
            {/* CARD */}
            <Box
              sx={{
                width: 75,
                height: 75,
                borderRadius: "50%",
                margin: "0 auto",
                position: "relative",

                background:
                  "linear-gradient(135deg, #ffffff, #ffffff)",
                padding: "2px",

                transition: "0.4s",

                "&:hover": {
                  transform: "translateY(-8px) scale(1.08)",
                }
              }}
            >
              {/* inner */}
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
                }}
              >
                <Box
                  component="img"
                  src={item.img}
                  sx={{
                    width: 40,
                    height: 40,
                    objectFit: "contain",
                    transition: "0.3s"
                  }}
                />
              </Box>
            </Box>

            {/* TEXT */}
            <Typography
              sx={{
                mt: 1.5,
                fontSize: 13,
                color: "#333",
                fontWeight: 500,
                whiteSpace: "pre-line",
                transition: "0.3s"
              }}
            >
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeatureBar;