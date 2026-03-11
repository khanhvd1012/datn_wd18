import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Breadcrumbs,
  Link,
  IconButton,
  Rating,
  Chip,
  Stack,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

import { ShoppingCart } from "lucide-react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { useParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  description: string;
  sold?: number;
  rating?: number;
  discount?: number;
}

const ProductDetail = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);

  const { id } = useParams();
  const navigate = useNavigate();

  // ===== LẤY SẢN PHẨM =====
  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // ===== SẢN PHẨM LIÊN QUAN =====
  useEffect(() => {
    axios
      .get(`http://localhost:3000/products?_limit=4`)
      .then((res) => setRelated(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== ADD TO CART =====
  const addToCart = async () => {
    if (!product) return;

    const res = await axios.get(
      `http://localhost:3000/cart?productId=${product.id}`
    );

    if (res.data.length > 0) {
      const item = res.data[0];

      await axios.patch(`http://localhost:3000/cart/${item.id}`, {
        quantity: item.quantity + quantity,
      });
    } else {
      await axios.post("http://localhost:3000/cart", {
        productId: product.id,
        name: product.name,
        img: product.img,
        price: product.price,
        quantity,
      });
    }
  };

  const handleAddToCart = async () => {
    await addToCart();
    navigate("/cart");
  };

  const handleBuyNow = async () => {
    await addToCart();
    navigate("/checkout");
  };

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => Math.max(1, prev - 1));

  if (!product) {
    return (
      <Container>
        <Typography>Không tìm thấy sản phẩm</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Trang chủ
        </Link>
        <Typography>{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* IMAGE */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <img
                src={product.img}
                alt={product.name}
                style={{
                  width: "100%",
                  maxHeight: 420,
                  objectFit: "contain",
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* INFO */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={700}>
              {product.name}
            </Typography>

            <Stack direction="row" spacing={2}>
              <Rating value={product.rating || 4} precision={0.5} readOnly />
              <Typography color="gray">
                Đã bán {product.sold || 0}
              </Typography>
            </Stack>

            {/* PRICE */}
            <Typography
              variant="h4"
              sx={{ color: "#d70018", fontWeight: 700 }}
            >
              {product.price.toLocaleString()}₫
            </Typography>

            {product.discount && (
              <Chip
                label={`Giảm ${product.discount}%`}
                color="error"
                sx={{ width: "fit-content" }}
              />
            )}

            {/* KHUYẾN MÃI */}
            <Card sx={{ borderRadius: 3, bgcolor: "#fff7f7" }}>
              <CardContent>
                <Typography fontWeight={700} mb={1}>
                  🎁 Khuyến mãi
                </Typography>

                <Typography fontSize={14}>
                  ✔ Giảm thêm 5% khi thanh toán online
                </Typography>

                <Typography fontSize={14}>
                  ✔ Miễn phí giao hàng toàn quốc
                </Typography>

                <Typography fontSize={14}>
                  ✔ Bảo hành chính hãng 12 tháng
                </Typography>
              </CardContent>
            </Card>

            {/* SỐ LƯỢNG */}
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={decrease}>
                <RemoveIcon />
              </IconButton>

              <TextField
                value={quantity}
                size="small"
                sx={{ width: 70 }}
                inputProps={{ style: { textAlign: "center" } }}
              />

              <IconButton onClick={increase}>
                <AddIcon />
              </IconButton>
            </Stack>

            {/* BUTTON */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<ShoppingCart size={18} />}
                sx={{
                  flex: 1,
                  backgroundColor: "#ff6b35",
                }}
                onClick={handleAddToCart}
              >
                Thêm giỏ
              </Button>

              <Button
                variant="contained"
                sx={{
                  flex: 1,
                  backgroundColor: "#d70018",
                }}
                onClick={handleBuyNow}
              >
                Mua ngay
              </Button>

              <IconButton>
                <FavoriteBorderIcon />
              </IconButton>
            </Stack>

            {/* MÔ TẢ */}
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography fontWeight={700} mb={1}>
                  Mô tả sản phẩm
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography>{product.description}</Typography>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* SẢN PHẨM LIÊN QUAN */}
      <Box sx={{ mt: 7 }}>
        <Typography variant="h5" fontWeight={700} mb={3}>
          Sản phẩm liên quan
        </Typography>

        <Grid container spacing={3}>
          {related.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <CardContent>
                  <Box
                    component="img"
                    src={item.img}
                    sx={{
                      width: "100%",
                      height: 160,
                      objectFit: "contain",
                      mb: 2,
                    }}
                  />

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      height: 40,
                      overflow: "hidden",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#d70018",
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    {item.price.toLocaleString()}₫
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductDetail;