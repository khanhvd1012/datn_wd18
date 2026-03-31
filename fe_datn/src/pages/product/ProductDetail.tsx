import React, { useEffect, useState } from "react";
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
  Chip,
  LinearProgress,
  Snackbar,
  Paper,
  Divider,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HistoryIcon from "@mui/icons-material/History";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { getProductDetailApi } from "../../services/productService";
import { addToCartApi } from "../../services/cartService";
import { getReviewsByProductApi } from "../../services/reviewService";

interface Variant {
  _id: string;
  name: string;
  price: number;
  stock: number;
  color?: string;
  size?: string;
  storage?: string;
  material?: string;
  images?: string[];
}

interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  images?: string[];
  img?: string;
  countInStock?: number;
  variants?: Variant[];
  category?: string | { name: string };
  brand?: string | { name: string };
  original_price?: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!id) return;
      try {
        const productData = await getProductDetailApi(id);
        setProduct(productData);
        // Default select first variant if exists
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0]);
        }
        
        // Fetch reviews
        try {
          const reviewsRes = await getReviewsByProductApi(id);
          if (reviewsRes && reviewsRes.data) {
            setReviews(reviewsRes.data);
          }
        } catch (reviewErr) {
          console.error("Lỗi khi tải đánh giá:", reviewErr);
        }

      } catch (error) {
        setNotification({
          open: true,
          message: "Không thể tải thông tin sản phẩm",
          severity: "error",
        });
      }
    };
    fetchProductAndReviews();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCartApi({ 
        product_id: product._id || product.id || "", 
        variant_id: selectedVariant?._id,
        quantity 
      });
      window.dispatchEvent(new Event("cartUpdated"));
      setNotification({
        open: true,
        message: "Đã thêm vào giỏ hàng",
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: "Lỗi khi thêm vào giỏ hàng",
        severity: "error",
      });
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    
    const buyNowItem = {
      _id: "buynow-" + (product._id || product.id || Date.now()),
      product: {
        _id: product._id || product.id || "",
        name: product.name,
        images: selectedVariant?.images || product.images || [product.img],
        price: selectedVariant?.price || product.price,
      },
      variant: selectedVariant ? {
        _id: selectedVariant._id,
        name: selectedVariant.name,
        images: selectedVariant.images,
        price: selectedVariant.price,
      } : undefined,
      quantity: quantity,
      totalPrice: (selectedVariant?.price || product.price) * quantity,
    };
    
    navigate("/checkout", { state: { buyNowItem } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {!product ? (
        <Box sx={{ width: "100%", py: 10 }}>
          <LinearProgress />
        </Box>
      ) : (
        <>
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Trang chủ
            </Link>
            <Link to="/products" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sản phẩm
            </Link>
            <Typography color="text.primary" fontWeight="medium">
              {product.name}
            </Typography>
          </Breadcrumbs>

          <Grid container spacing={8}>
            {/* Left column: Images */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 4, 
                    overflow: "hidden", 
                    border: "1px solid #f0f0f0",
                    backgroundColor: "#fff",
                    position: 'relative'
                  }}
                >
                  <Box
                    component="img"
                    src={selectedVariant?.images?.[0] || product.images?.[0] || product.img}
                    alt={product.name}
                    sx={{ 
                      width: "100%", 
                      height: 500, 
                      display: "block", 
                      objectFit: "contain",
                      transition: '0.3s'
                    }}
                  />
                  {product.original_price && product.original_price > product.price && (
                    <Chip 
                      label={`-${Math.round((1 - product.price/product.original_price)*100)}%`}
                      color="error"
                      sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 'bold' }}
                    />
                  )}
                </Paper>

                {/* Thumbnails (if available) */}
                {(product.images && product.images.length > 1) && (
                  <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
                    {product.images.map((img, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={img}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          border: "2px solid #eee",
                          cursor: 'pointer',
                          objectFit: 'cover',
                          "&:hover": { borderColor: 'primary.main' }
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </Grid>

            {/* Right column: Info */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={3} sx={{ textAlign: 'left' }}>
                <Box>
                  <Typography variant="overline" color="primary" fontWeight="bold" letterSpacing={1}>
                    {(typeof product.brand === 'object' ? product.brand.name : product.brand) || "CHÍNH HÃNG"}
                  </Typography>
                  <Typography variant="h4" fontWeight="700" sx={{ mt: 1, mb: 1.5, color: '#1a1a1a', lineHeight: 1.4 }}>
                    {product.name}
                  </Typography>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={product.rating || 4.5} readOnly precision={0.5} size="small" />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 'bold' }}>{product.rating || 4.5}</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Typography color="text.secondary" variant="body2">1.2k Đánh giá</Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography color="text.secondary" variant="body2">2.5k Đã bán</Typography>
                  </Stack>
                </Box>

                <Box sx={{ p: 2.5, borderRadius: 2, backgroundColor: "#fafafa", border: '1px solid #f0f0f0' }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h4" color="error" fontWeight="700">
                      {(selectedVariant?.price || product.price)?.toLocaleString()}₫
                    </Typography>
                    {product.original_price && (
                      <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                        {product.original_price?.toLocaleString()}₫
                      </Typography>
                    )}
                  </Stack>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: '500' }}>
                    Tiết kiệm: {(product.original_price ? (product.original_price - product.price) : 0).toLocaleString()}₫
                  </Typography>
                </Box>

                {product.variants && product.variants.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" mb={1.5} color="text.secondary" textTransform="uppercase">
                      Lựa chọn phiên bản:
                    </Typography>
                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    {product.variants.map((v) => (
                      <Button
                        key={v._id}
                        variant={selectedVariant?._id === v._id ? "contained" : "outlined"}
                        onClick={() => setSelectedVariant(v)}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          boxShadow: 'none',
                          minWidth: 'fit-content',
                          "&:hover": { boxShadow: 'none' }
                        }}
                      >
                        {v.name}
                      </Button>
                    ))}
                  </Stack>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" mb={1.5} color="text.secondary" textTransform="uppercase">
                    Số lượng:
                  </Typography>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box 
                      sx={{ 
                        display: "flex", 
                        alignItems: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                        p: 0.5,
                        width: 'fit-content'
                      }}
                    >
                      <IconButton 
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))} 
                        size="medium"
                        sx={{ color: '#000' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ px: 3, minWidth: 50, textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
                        {quantity}
                      </Typography>
                      <IconButton 
                        onClick={() => setQuantity((q) => q + 1)} 
                        size="medium"
                        sx={{ color: '#000' }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {selectedVariant ? selectedVariant.stock : (product.countInStock || 0)} sản phẩm có sẵn
                    </Typography>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={handleAddToCart}
                    startIcon={<ShoppingCartIcon />}
                    sx={{ 
                      py: 2, 
                      borderRadius: 3, 
                      borderWidth: 2, 
                      fontWeight: 'bold',
                      fontSize: 16,
                      "&:hover": { borderWidth: 2 } 
                    }}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleBuyNow}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      fontSize: 16,
                      fontWeight: 'bold',
                      background: "linear-gradient(90deg,#ff512f,#dd2476)",
                      boxShadow: "0 4px 15px rgba(221,36,118,0.3)",
                      "&:hover": {
                        background: "linear-gradient(90deg,#e94426,#c21d64)",
                        boxShadow: "0 6px 20px rgba(221,36,118,0.4)",
                      }
                    }}
                  >
                    Mua ngay
                  </Button>
                </Stack>

                {/* Trust Signals */}
                <Box sx={{ mt: 2, pt: 3, borderTop: '1px solid #eee' }}>
                  <Stack 
                    direction={{ xs: "column", sm: "row" }} 
                    spacing={3} 
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <VerifiedUserIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      <Typography fontSize={12} fontWeight="bold">CHÍNH HÃNG 100%</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocalShippingIcon sx={{ color: '#2196f3', fontSize: 20 }} />
                      <Typography fontSize={12} fontWeight="bold">MIỄN PHÍ VẬN CHUYỂN</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <HistoryIcon sx={{ color: '#ff9800', fontSize: 20 }} />
                      <Typography fontSize={12} fontWeight="bold">DỄ DÀNG ĐỔI TRẢ</Typography>
                    </Stack>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                    Mô tả sản phẩm:
                  </Typography>
                  <Typography color="text.secondary" sx={{ whiteSpace: "pre-line", lineHeight: 1.8 }}>
                    {product.description || "Thông tin sản phẩm đang được cập nhật..."}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>

          {/* ĐÁNH GIÁ SẢN PHẨM */}
          <Box sx={{ mt: 10 }}>
            <Typography variant="h5" fontWeight="bold" mb={4}>
              Đánh giá từ khách hàng ({reviews.length})
            </Typography>

            {reviews.length === 0 ? (
              <Paper elevation={0} sx={{ p: 5, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 4, border: '1px dashed #e0e0e0' }}>
                <Typography color="text.secondary" variant="subtitle1">
                  Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {reviews.map((review) => (
                  <Paper key={review._id} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #f0f0f0' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                      <Box sx={{ flexShrink: 0 }}>
                        <Stack alignItems="center" spacing={1}>
                          <Box
                            component="img"
                            src={review.user_id?.avatar || "https://ui-avatars.com/api/?name=" + (review.user_id?.username || 'User')}
                            sx={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                          />
                          <Typography variant="subtitle2" fontWeight="bold">
                            {review.user_id?.username || "Khách hàng"}
                          </Typography>
                        </Stack>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                          <Rating value={review.rating} readOnly size="small" />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Stack>
                        {review.product_variant_id && (
                          <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 1 }}>
                            Phân loại: {review.product_variant_id.name}
                          </Typography>
                        )}
                        <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#333' }}>
                          {review.comment}
                        </Typography>

                        {/* Admin Reply */}
                        {review.admin_reply && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f8ff', borderRadius: 2, borderLeft: '3px solid #1976d2' }}>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" mb={0.5}>
                              Phản hồi từ người bán:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {review.admin_reply}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        </>
      )}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity as any}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
