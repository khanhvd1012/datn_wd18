import { Box, Typography } from "@mui/material";

// import ảnh
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
    <Box sx={{ background: "",my:3, py: 3, px: { xs: 2, md: 10 } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {features.map((item, index) => (
          <Box key={index} sx={{ textAlign: "center", cursor: "pointer" }}>
            
            {/* khung icon */}
            <Box
              sx={{
                width: 50,
                height: 70,
                border: "1px",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",

                "&:hover img": {
                  transform: "scale(1.1)",
                    border: "1px solid #ebe64d",
                    borderRadius: 3,

                }
              }}
            >
              <img
                src={item.img}
                alt=""
                style={{
                  width: 40,
                  height: 40,
                  objectFit: "contain",
                  transition: "0.2s"
                }}
              />
            </Box>

            <Typography
              sx={{
                mt: 1,
                fontSize: 14,
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
