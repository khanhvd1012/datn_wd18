import React, { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Rating,
  TextField,
  Chip,
  Divider,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const formatPrice = (price: number) => {
    return price?.toLocaleString("vi-VN") + "₫";
  };

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        const productData = res.data;
        setProduct(productData);

        // Handle images
        const productImages = productData.images || [];
        if (productData.img) {
          productImages.unshift(productData.img);
        }
        setImages(productImages.length > 0 ? productImages : []);
        setSelectedImage(productImages[0] || "");
      } catch (error) {
        console.error("Error fetching product:", error);
        showSnackbar("Không thể tải thông tin sản phẩm", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.category) return;
      try {
        const res = await api.get(`/products?category=${product.category}&limit=4`);
        const list = Array.isArray(res.data) ? res.data : res.data.docs || res.data.data || [];
        const filtered = list.filter((p: any) => p._id !== id);
        setRelated(filtered.slice(0, 4));
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    fetchRelated();
  }, [product?.category, id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews?productId=${id}`);
        setReviews(res.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post("/cart", {
        productId: product._id || product.id,
        name: product.name,
        img: selectedImage || product.img,
        price: product.price,
        quantity: qty,
      });

      window.dispatchEvent(new Event("cartUpdated"));
      showSnackbar("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Add cart error:", error);
      showSnackbar("Không thể thêm vào giỏ hàng", "error");
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate("/cart");
  };

  const submitReview = async () => {
    if (!comment) return;

    try {
      const newReview = {
        productId: id,
        rating,
        comment,
      };

      const res = await api.post("/reviews", newReview);
      setReviews([...reviews, res.data]);
      setComment("");
      setRating(5);
      showSnackbar("Cảm ơn bạn đã đánh giá!");
    } catch (error) {
      console.error("Error submitting review:", error);
      showSnackbar("Không thể gửi đánh giá", "error");
    }
  };

  const total = reviews.length;
  const avg = total ? reviews.reduce((a, b) => a + b.rating, 0) / total : 0;

  const countStar = (star: number) => {
    return reviews.filter((r) => r.rating === star).length;
  };

  if (loading) {
    return (
      <Box sx={{ background: "#f5f5f5", py: 6 }}>
        <Container maxWidth="lg">
          <Card sx={{ p: 4, borderRadius: 4 }}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={5}>
                <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 3 }} />
                <Stack direction="row" spacing={1} mt={2}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" width={70} height={70} />
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={7}>
                <Skeleton variant="text" height={60} />
                <Skeleton variant="text" height={40} />
                <Skeleton variant="text" height={60} />
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5">Không tìm thấy sản phẩm</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Về trang chủ
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ background: "#f5f5f5", py: 6 }}>
      <Container maxWidth="lg">
        <Card sx={{ p: 4, borderRadius: 4 }}>
          <Grid container spacing={6}>
            {/* IMAGE */}
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={selectedImage}
                onError={(e: any) => {
                  e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                }}
                sx={{
                  width: "100%",
                  height: 420,
                  objectFit: "contain",
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: "1px solid #eee",
                }}
              />

              {images.length > 1 && (
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" gap={1}>
                  {images.map((img, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={img}
                      onClick={() => setSelectedImage(img)}
                      onError={(e: any) => {
                        e.target.style.display = "none";
                      }}
                      sx={{
                        width: 70,
                        height: 70,
                        border: selectedImage === img ? "2px solid #d70018" : "1px solid #ddd",
                        borderRadius: 2,
                        cursor: "pointer",
                        p: 0.5,
                        objectFit: "contain",
                        bgcolor: "#fff",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Grid>

            {/* INFO */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight="bold">
                  {product.name}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating value={avg} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({total} đánh giá)
                  </Typography>
                </Stack>

                <Box>
                  <Typography variant="h4" fontWeight="bold" color="#d70018">
                    {formatPrice(product.price)}
                  </Typography>
                  {product.original_price && product.original_price > product.price && (
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                      {formatPrice(product.original_price)}
                    </Typography>
                  )}
                </Box>

                <Chip label="Miễn phí vận chuyển" color="success" variant="outlined" />

                <Divider />

                {/* QUANTITY */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography fontWeight="bold">Số lượng:</Typography>

                  <Stack direction="row" alignItems="center" sx={{ border: "1px solid #ddd", borderRadius: 2 }}>
                    <IconButton onClick={() => setQty(qty > 1 ? qty - 1 : 1)} size="small">
                      <RemoveIcon />
                    </IconButton>

                    <TextField
                      size="small"
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                      sx={{ width: 70 }}
                      inputProps={{ style: { textAlign: "center" } }}
                    />

                    <IconButton onClick={() => setQty(qty + 1)} size="small">
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    Còn lại: {product.countInStock || 0} sản phẩm
                  </Typography>
                </Stack>

                {/* BUTTON */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    sx={{ flex: 1, background: "#ff6b35" }}
                    onClick={addToCart}
                  >
                    Thêm giỏ hàng
                  </Button>

                  <Button
                    variant="contained"
                    sx={{ flex: 1, background: "#d70018" }}
                    onClick={buyNow}
                  >
                    Mua ngay
                  </Button>

                  <IconButton sx={{ border: "1px solid #ddd" }}>
                    <FavoriteBorderIcon />
                  </IconButton>
                </Stack>

                <Divider />

                <Stack direction="row" spacing={2} alignItems="center">
                  <LocalShippingIcon color="action" />
                  <Typography variant="body2">
                    Giao hàng toàn quốc - Giao nhanh 24h
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Card>

        {/* TABS */}
        <Box mt={5}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ borderBottom: "1px solid #eee" }}>
            <Tab label="Mô tả" />
            <Tab label={`Đánh giá (${total})`} />
          </Tabs>

          <Paper sx={{ p: 3, mt: 2 }}>
            {tab === 0 && (
              <Box>
                <Typography variant="h6" mb={2}>
                  Mô tả sản phẩm
                </Typography>
                <Typography sx={{ whiteSpace: "pre-wrap" }}>
                  {product.description || "Chưa có mô tả cho sản phẩm này."}
                </Typography>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Grid container spacing={4} mb={4}>
                  <Grid item xs={12} md={3} textAlign="center">
                    <Typography variant="h3" color="error" fontWeight="bold">
                      {avg.toFixed(1)}
                    </Typography>

                    <Rating value={avg} precision={0.5} readOnly />
                    <Typography variant="body2">{total} đánh giá</Typography>
                  </Grid>

                  <Grid item xs={12} md={9}>
                    {[5, 4, 3, 2, 1].map((star) => {
                      const percent = total ? (countStar(star) / total) * 100 : 0;

                      return (
                        <Stack key={star} direction="row" spacing={2} alignItems="center" mb={1}>
                          <Typography>{star} sao</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{ flex: 1, height: 10, borderRadius: 5 }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                            {Math.round(percent)}%
                          </Typography>
                        </Stack>
                      );
                    })}
                  </Grid>
                </Grid>

                {/* REVIEW FORM */}
                <Paper sx={{ p: 3, mb: 4, bgcolor: "#f9f9f9" }}>
                  <Typography variant="h6" mb={2}>
                    Viết đánh giá của bạn
                  </Typography>

                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Typography>Đánh giá:</Typography>
                      <Rating
                        value={rating}
                        onChange={(e, v: any) => setRating(v || 5)}
                      />
                    </Stack>

                    <TextField
                      label="Bình luận"
                      multiline
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                    />

                    <Button variant="contained" onClick={submitReview} sx={{ alignSelf: "flex-start" }}>
                      Gửi đánh giá
                    </Button>
                  </Stack>
                </Paper>

                {/* REVIEW LIST */}
                <Stack spacing={2}>
                  {reviews.length === 0 ? (
                    <Typography textAlign="center" color="text.secondary" py={4}>
                      Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                    </Typography>
                  ) : (
                    reviews.map((r: any) => (
                      <Paper key={r._id || r.id} sx={{ p: 2, border: "1px solid #eee" }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography fontWeight="bold">
                              {r.user?.username || r.user?.name || "Người dùng"}
                            </Typography>
                            <Rating value={r.rating} readOnly size="small" />
                          </Stack>
                          <Typography variant="caption" color="text.secondary">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : ""}
                          </Typography>
                        </Stack>
                        <Typography mt={1}>{r.comment}</Typography>
                      </Paper>
                    ))
                  )}
                </Stack>
              </Box>
            )}
          </Paper>
        </Box>

        {/* RELATED */}
        {related.length > 0 && (
          <Box mt={6}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
              Sản phẩm liên quan
            </Typography>

            <Grid container spacing={3}>
              {related.map((item: any) => (
                <Grid item xs={12} sm={6} md={3} key={item._id || item.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => navigate(`/product/${item._id || item.id}`)}
                  >
                    <CardContent>
                      <Box
                        component="img"
                        src={item.images?.[0] || item.img}
                        onError={(e: any) => {
                          e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                        }}
                        sx={{
                          width: "100%",
                          height: 160,
                          objectFit: "contain",
                        }}
                      />
                      <Typography fontWeight="bold" sx={{ mt: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography color="#d70018" fontWeight="bold">
                        {formatPrice(item.price)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetail;
