import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
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
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              backgroundColor: "#ff6a00",
              color: "#fff",
              px: 5,
              py: 1,
              fontWeight: "bold",
              fontSize: 18,
              clipPath:
                "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
            }}
          >
            PHỤ KIỆN NỔI BẬT
          </Box>
        </Box>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)", // 5 sản phẩm / 1 hàng
            },
            gap: 2,
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
                <CardMedia
                  component="img"
                  image={item.img}
                  alt={item.name}
                  sx={{
                    height: 200,
                    objectFit: "contain",
                    backgroundColor: "#fff",
                    p: 2,
                  }}
                />

                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#eee",
                      minHeight: 48,
                      mb: 1,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#ff3b3b",
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {formatPrice(item.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedProducts;