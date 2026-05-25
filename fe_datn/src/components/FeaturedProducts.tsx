import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<any[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list =
          Array.isArray(data)
            ? data
            : data.docs || data.data || [];

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

  // NEXT
  const handleNext = () => {
    if (startIndex + 3 < products.length) {
      setStartIndex(startIndex + 1);
    }
  };

  // PREV
  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <Box
      sx={{
        py: 6,
        background: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          maxWidth: 1300,
          mx: "auto",
          px: 2,
        }}
      >
        {/* TITLE */}
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
            textAlign: "center",
            mb: 5,
            color: "#222",
            letterSpacing: 1,
          }}
        >
          PHỤ KIỆN NỔI BẬT
        </Typography>

        <Box
          sx={{
            position: "relative",
          }}
        >
          {/* BUTTON LEFT */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: -25,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 50,
              height: 50,
              background: "#000",

              color: "#fff",

              "&:hover": {
                background: "#222",
              },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* BUTTON RIGHT */}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: -25,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 10,
              width: 50,
              height: 50,
              background: "#555",

              color: "#fff",

              "&:hover": {
                background: "#434242",
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
          </IconButton>

          {/* SLIDER */}
          <Box
            sx={{
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                transition: "0.9s ease",
                transform: `translateX(-${
                  startIndex * (100 / 3)
                }%)`,
              }}
            >
              {products.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    width: "33.3333%",
                    flexShrink: 0,
                    px: 1.5,
                  }}
                >
                  <Card
                    onMouseEnter={() =>
                      setHoveredId(item.id)
                    }
                    onMouseLeave={() =>
                      setHoveredId(null)
                    }
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      position: "relative",
                      cursor: "pointer",
                      height: 420,
                      boxShadow:
                        "0 6px 20px rgba(0,0,0,0.08)",

                      "&:hover img": {
                        transform: "scale(1.08)",
                      },
                    }}
                  >
                    {/* IMAGE */}
                    <Box
                      sx={{
                        width: "100%",
                        height: 420,
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.img}
                        alt={item.name}
                        onError={(e: any) => {
                          e.target.src =
                            "/no-image.png";
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "0.5s",
                        }}
                      />

                      {/* OVERLAY */}
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",

                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",

                          p: 3,

                          opacity:
                            hoveredId === item.id
                              ? 1
                              : 0,

                          transition: "0.4s",
                        }}
                      >
                        {/* NAME */}
                        <Typography
                          sx={{
                            color: "#fff",
                            fontSize: 24,
                            fontWeight: 600,
                            mb: 1,
                          }}
                        >
                          {item.name}
                        </Typography>

                        {/* PRICE */}
                        <Typography
                          sx={{
                            color: "#ffd700",
                            fontSize: 20,
                            fontWeight: "bold",
                            mb: 2,
                          }}
                        >
                          {formatPrice(item.price)}
                        </Typography>

                        {/* BUTTON */}
                        <Box
                          onClick={() =>
                            navigate(
                              `/product/${item.id}`,
                            )
                          }
                          sx={{
                            width: "fit-content",
                            px: 3,
                            py: 1.2,
                            borderRadius: 2,
                            background: "#fff",
                            color: "#000",
                            fontWeight: 700,
                            transition: "0.3s",

                            "&:hover": {
                              background: "#ffd700",
                            },
                          }}
                        >
                          Xem thêm
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedProducts;