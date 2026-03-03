import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  sold?: number;
  discount?: number;
  category?: string;
  subCategory?: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortType, setSortType] = useState("default");
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const sub = queryParams.get("sub");

  useEffect(() => {
    let url = "http://localhost:3000/products";

    if (category) url += `?category=${category}`;
    if (sub) url += `&subCategory=${sub}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [category, sub]);

  const sortedProducts = useMemo(() => {
    let sorted = [...products];

    switch (sortType) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "sold":
        return sorted.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
      case "discount":
        return sorted.sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));
      default:
        return sorted;
    }
  }, [products, sortType]);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + "đ";

  return (
    <Box sx={{ backgroundColor: "#f5f5f7", py: 4 }}>
      <Box sx={{ maxWidth: 1280, mx: "auto", px: 2 }}>

        {/* NÚT TRANG CHỦ */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              bgcolor: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              "&:hover": {
                bgcolor: "#ffeaea",
                color: "#d70018"
              }
            }}
          >
            Trang chủ
          </Button>
        </Box>

        {/* HEADER */}
        <Typography variant="h5" fontWeight={700} mb={3}>
          {category ? decodeURIComponent(category) : "Gợi ý hôm nay 🔥"}
        </Typography>

        {/* THANH SẮP XẾP */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            p: 2,
            bgcolor: "#fff",
            borderRadius: 3,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
          }}
        >
          <Typography fontWeight={600}>Sắp xếp:</Typography>

          <Button
            variant={sortType === "default" ? "contained" : "outlined"}
            onClick={() => setSortType("default")}
          >
            Mặc định
          </Button>

          <Button
            variant={sortType === "price-asc" ? "contained" : "outlined"}
            onClick={() => setSortType("price-asc")}
          >
            Giá ↑
          </Button>

          <Button
            variant={sortType === "price-desc" ? "contained" : "outlined"}
            onClick={() => setSortType("price-desc")}
          >
            Giá ↓
          </Button>

          <Select
            size="small"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            sx={{ ml: "auto", minWidth: 200 }}
          >
            <MenuItem value="sold">Bán chạy nhất</MenuItem>
            <MenuItem value="discount">Giảm giá nhiều nhất</MenuItem>
          </Select>
        </Box>

        {/* GRID SẢN PHẨM */}
        <Grid container spacing={3}>
          {sortedProducts.map((item) => {
            const oldPrice = item.discount
              ? item.price / (1 - item.discount / 100)
              : null;

            return (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <Link
                  to={`/product/${item.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: 4,
                      backgroundColor: "#fff",
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      },
                      "&:hover .hover-btn": {
                        opacity: 1,
                        transform: "translate(-50%, 0)",
                      },
                      "&:hover img": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {item.discount && (
                      <Chip
                        label={`-${item.discount}%`}
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          background: "#d70018",
                          color: "#fff",
                          fontWeight: 700,
                          zIndex: 2,
                        }}
                      />
                    )}

                    <Box sx={{ backgroundColor: "#fafafa", textAlign: "center", p: 2 }}>
                      <CardMedia
                        component="img"
                        image={item.img}
                        alt={item.name}
                        sx={{
                          height: 200,
                          objectFit: "contain",
                          transition: "0.4s",
                        }}
                      />
                    </Box>

                    <CardContent sx={{ px: 2, pb: 2 }}>
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          height: 48,
                          overflow: "hidden",
                          mb: 1,
                          color: "#333",
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography
                          sx={{
                            color: "#d70018",
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          {formatPrice(item.price)}
                        </Typography>

                        {oldPrice && (
                          <Typography
                            sx={{
                              fontSize: 13,
                              color: "#999",
                              textDecoration: "line-through",
                            }}
                          >
                            {formatPrice(Math.round(oldPrice))}
                          </Typography>
                        )}
                      </Box>

                      <Typography
                        sx={{ fontSize: 12, color: "#777", mt: 0.5 }}
                      >
                        Đã bán {item.sold ?? 0}
                      </Typography>
                    </CardContent>

                    <Box
                      className="hover-btn"
                      sx={{
                        position: "absolute",
                        bottom: 15,
                        left: "50%",
                        transform: "translate(-50%, 20px)",
                        opacity: 0,
                        transition: "0.3s",
                      }}
                    >
                      <Button
                        variant="contained"
                        sx={{
                          background: "#d70018",
                          borderRadius: 3,
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          "&:hover": {
                            background: "#b50014",
                          },
                        }}
                      >
                        Thêm vào giỏ
                      </Button>
                    </Box>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>

      </Box>
    </Box>
  );
};

export default ProductList;