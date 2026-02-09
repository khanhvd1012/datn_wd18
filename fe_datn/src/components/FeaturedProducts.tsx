import { useEffect, useState } from "react";
import {
  Box,
  Grid,
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
    <Box sx={{ backgroundColor: "#111", p: 1.2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <Box
          sx={{
            backgroundColor: "#ff6a00",
            color: "#fff",
            px: 4.8,
            py: 1,
            fontWeight: "bold",
            clipPath:
              "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
          }}
        >
          PHỤ KIỆN NỔI BẬT
        </Box>
      </Box>

      {/* Product grid */}
      <Grid
        container
        spacing={1}
        // sx={{
        //   maxHeight: "818px", // gioi hạn số hàng
        //   overflow: "hidden",
        // }}
      >
        {products.slice(0,10).map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}>
            <Link
              to={`/product/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  height: "400px",
                  width: "236px",
                  transition: "0.6s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#ff6a00",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={item.img}
                  alt={item.name}
                  sx={{
                    height: 220,
                    objectFit: "contain",
                    backgroundColor: "#fff",
                    p: 1,
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
          </Grid>
        ))}
      </Grid>


    </Box>
  );
};

export default FeaturedProducts;
