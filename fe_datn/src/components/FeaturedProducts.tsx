import { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  oldPrice?: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {

        // Handle array or paginated object
        const list = Array.isArray(data) ? data : (data.docs || data.data || []);
        
        // Map data to match local interface if needed
        const mappedList = list.map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          img: item.img || (item.images && item.images[0]) || "https://via.placeholder.com/200",
          price: item.price
        }));
        
        setProducts(mappedList);
      })
      .catch((err) => console.error("Lỗi load products:", err));
  }, []);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  return (

    <Box sx={{ backgroundColor: "#f3f3f3", py: 4 }}>
      {/* Container */}
      <Box
        sx={{
          maxWidth: "1300px",
          margin: "auto",
          px: 2,
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 700,
              color: "#ee4d2d",
              borderLeft: "5px solid #ee4d2d",
              pl: 2
            }}
          >
            🔥 SẢN PHẨM NỔI BẬT
          </Typography>
        </Box>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2,1fr)",
              sm: "repeat(3,1fr)",
              md: "repeat(4,1fr)",
              lg: "repeat(5,1fr)"
            },
            gap: 2
          }}
        >

          {products.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  backgroundColor: "#2f2e2e",
                  border: "1px solid #dcdcdc",
                  height: "100%",
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#ff6a00",
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                  },
                }}
              >
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    background: "#fff",
                    position: "relative",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                    }
                  }}
                >

                  {/* SALE BADGE */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "#ee4d2d",
                      color: "#fff",
                      fontSize: 12,
                      px: 1,
                      borderRadius: 1,
                      zIndex: 2
                    }}
                  >
                    -{discount}%
                  </Box>

                  {/* HOT */}
                  <Chip
                    label="HOT"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bgcolor: "#ff9800",
                      color: "#fff",
                      fontWeight: 600
                    }}
                  />

                  {/* IMAGE */}
                  <Box
                    sx={{
                      height: 180,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      p: 2,
                      overflow: "hidden"
                    }}
                  >
                    <Box
                      component="img"
                      src={item.img}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                        transition: "0.4s",
                        "&:hover": {
                          transform: "scale(1.1)"
                        }
                      }}
                    />
                  </Box>

                  {/* INFO */}
                  <Box sx={{ p: 1.5 }}>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#333",
                        height: 40,
                        overflow: "hidden"
                      }}
                    >
                      {item.name}
                    </Typography>

                    {/* PRICE */}
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        sx={{
                          color: "#ee4d2d",
                          fontWeight: 700,
                          fontSize: 16
                        }}
                      >
                        {formatPrice(item.price)}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 12,
                          color: "#999",
                          textDecoration: "line-through"
                        }}
                      >
                        {formatPrice(item.oldPrice!)}
                      </Typography>
                    </Box>

                    {/* SOLD */}
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#777",
                        mt: 0.5
                      }}
                    >
                      Đã bán {Math.floor(Math.random() * 500)}
                    </Typography>
                  </Box>
                </Card>
              </Link>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedProducts;