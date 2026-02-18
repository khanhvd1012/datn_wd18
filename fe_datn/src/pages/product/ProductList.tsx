import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  sold?: number;
  discount?: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + "đ";

  return (
    <Box sx={{ backgroundColor: "#111", p: 2 ,position: "relative",mt:1}}>
      {/* ===== HEADER ===== */}
      <Box
      sx={{
        position: "sticky",
        top: 0,
        backgroundColor: "#111",
        zIndex: 10,
        textAlign: "center",
        color: "#ff5722",
        borderBottom: "2px solid #ff5722",
        py: 1,
        mb: 2.5
      }}
  >
    GỢI Ý HÔM NAY 🔥
  </Box>

      {/* ===== PRODUCT GRID ===== */}
      <Grid container spacing={1}>
        {products.slice(0, 18).map((item) => ( // Hiển thị 18sản phẩm đầu tiên(3 hàng)
          <Grid item xs={6} sm={4} md={2} key={item.id}>
            <Link
              to={`/product/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  height: 300,
                  width: 193,
                  border: "1.3px solid #b09b9b",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 3,
                  },
                }}
              >
                {/* IMAGE */}
                <Box sx={{ position: "relative" }}>
                  {item.discount && (
                    <Chip
                      label={`-${item.discount}%`}
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        fontWeight: "bold",
                      }}
                    />
                  )}

                  <CardMedia
                    component="img"
                    image={item.img}
                    alt={item.name}
                    sx={{
                      height: 150,
                      width: "100%",
                      objectFit: "contain",
                      backgroundColor: "#fff",
                      p: 1,
                    }}
                  />
                </Box>

                {/* CONTENT */}
                <CardContent sx={{ p: 1 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#333",
                      height: 70,
                      overflow: "hidden",
                      mb: 0.5,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#ee4d2d",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {formatPrice(item.price)}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "#777",
                      mt: 0.3,
                    }}
                  >
                    Đã bán {item.sold ?? Math.floor(Math.random() * 1000)}
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

export default ProductList;