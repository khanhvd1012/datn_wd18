import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0); 
const [hoverSide, setHoverSide] = useState<"left" | "right" | null>(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.docs || data.data || [];

        const mappedList = list.map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          img:
            item.img ||
            (item.images && item.images[0]) ||
            "/no-image.png",
          price: item.price,
        }));

        setProducts(mappedList);
      });
  }, []);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  //  next / prev
  const handleNext = () => {
    if (startIndex + 4 < products.length) {
      setStartIndex(startIndex + 4);
    }
  };

  const handlePrev = () => {
    if (startIndex - 4 >= 0) {
      setStartIndex(startIndex - 4);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1300, mx: "auto", px: 2 }}>
        {/* HEADER */}
        <Box
          sx={{
            fontFamily: "Anton, sans-serif",
            fontSize: 28,
            letterSpacing: "2px",
            color: "#ff3b1f",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 2,
          }}
        >
          PHỤ KIỆN NỔI BẬT
        </Box>

       <Box sx={{ position: "relative" }}>

  {/* VÙNG CLICK TRÁI */}
      <Box
        onClick={handlePrev}
        sx={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 60,
          zIndex: 5,
          cursor: startIndex > 0 ? "pointer" : "default",

          "&:active": {
            background: "rgba(158, 42, 42, 0.05)", // hiệu ứng click
          },
        }}
      />

      {/* VÙNG CLICK PHẢI */}
      <Box
        onClick={handleNext}
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          zIndex: 5,
          cursor:
            startIndex + 4 < products.length ? "pointer" : "default",

          "&:active": {
            background: "rgba(92, 223, 66, 0.05)",
          },
        }}
      />

      <Box
        sx={{
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            transition: "transform 0.4s ease",
            transform: `translateX(-${startIndex * (100 / 4)}%)`,
          }}
        >
          {products.map((item) => (
            <Box
              key={item.id}
              sx={{
                width: "25%", 
                flexShrink: 0,
                px: 1,
              }}
            >
              <Card
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  height: 300,
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* IMAGE */}
                <Box
                  sx={{
                    width: "100%",
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ebeaea",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={item.img}
                    alt={item.name}
                    onError={(e: any) => {
                      e.target.src = "/no-image.png";
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                {/* INFO */}
                <Box sx={{ p: 1.5 }}>
                  <Box sx={{ color: "#fadb14", fontSize: 14 ,pl:25}}>
                    {"★★★★☆"}
                  </Box>

                  <Box
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.name}
                  </Box>

                  <Box
                    sx={{
                      color: "#ff4d4f",
                      fontWeight: "bold",
                      fontSize: 15,
                      mt: 1,
                    }}
                  >
                    {formatPrice(item.price)}
                  </Box>
                </Box>

                {/* OVERLAY */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: hoveredId === item.id ? 1 : 0,
                    transition: "0.3s",
                  }}
                >
                  <Box
                    onClick={() =>
                      (window.location.href = `/product/${item.id}`)
                    }
                    sx={{
                      background: "#ff0000",
                      color: "#fff",
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: "bold",
                    }}
                  >
                    Mua ngay
                  </Box>
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
      </Box>

      {/* NOTIFICATION */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() =>
          setNotification((p) => ({ ...p, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeaturedProducts;