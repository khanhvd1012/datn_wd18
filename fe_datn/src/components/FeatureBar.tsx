import { Box, Typography } from "@mui/material";

import hangquocte from "../img/FeatureBar_hangquocte.webp";
import shop from "../img/FeatureBar_shopxuly.webp";
import deal from "../img/FeatureBar_dealhot.webp";
import style from "../img/FeatureBar_hangquocte.webp";
import khachhang from "../img/FeatureBar_khachhang.webp";
import magiamgia from "../img/FeatureBar_magiamgia.webp";

const features = [
  { img: hangquocte, text: "Hàng Quốc Tế" },
  { img: shop, text: "Shop Xử Lý" },
  { img: deal, text: "Deal Hot\nGiờ Vàng" },
  { img: style, text: "Shop Style\nVoucher 30%" },
  { img: khachhang, text: "Khách Hàng\nThân Thiết" },
  { img: magiamgia, text: "Mã Giảm Giá" }
];

const FeatureBar = () => {
  return (
    <Box
      sx={{
        my: 3,
        py: 3,
        px: { xs: 2, md: 10 },
        background: "#fafafa"
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(3,1fr)",
            sm: "repeat(4,1fr)",
            md: "repeat(6,1fr)"
          },
          gap: 3
        }}
      >
        {features.map((item, index) => (
          <Box key={index} sx={{ textAlign: "center", cursor: "pointer" }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                background: "#fff",
                transition: "0.3s",

                "&:hover": {
                  border: "1px solid #facc15",
                  transform: "translateY(-3px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                },

                "& img": {
                  width: 38,
                  height: 38,
                  objectFit: "contain",
                  transition: "0.3s"
                },

                "&:hover img": {
                  transform: "scale(1.1)"
                }
              }}
            >
              <img src={item.img} alt="" />
            </Box>

            <Typography
              sx={{
                mt: 1,
                fontSize: 13,
                color: "#555",
                whiteSpace: "pre-line"
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