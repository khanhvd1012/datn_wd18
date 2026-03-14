import { useEffect, useState } from "react";
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
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material";

import { ShoppingCart } from "lucide-react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import { useParams, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  _id?: string;
  name: string;
  img: string;
  price: number;
  description: string;
  sold?: number;
  rating?: number;
  discount?: number;
}

interface Variant {
  _id: string;
  name: string;
  price: number;
  original_price?: number;
  stock: number;
  attributes?: Record<string, string>;
  images?: string[];
  is_default?: boolean;
  sku?: string;
}

const ProductDetail = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loadingVariants, setLoadingVariants] = useState<boolean>(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // ===== LẤY SẢN PHẨM =====
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        // Lấy variants của sản phẩm
        loadVariants(id!);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ===== LẤY VARIANTS =====
  const loadVariants = async (productId: string) => {
    try {
      setLoadingVariants(true);
      // Thử gọi API backend trước, nếu không có thì bỏ qua
      const response = await axios.get(
        `http://localhost:3000/api/variants/product/${productId}`
      );
      if (response.data && response.data.variants) {
        setVariants(response.data.variants);
        // Tự động chọn variant mặc định hoặc variant đầu tiên
        const defaultVariant = response.data.variants.find(
          (v: Variant) => v.is_default
        ) || response.data.variants[0];
        if (defaultVariant) {
          setSelectedVariant(defaultVariant);
        }
      }
    } catch (error) {
      // Nếu API không tồn tại hoặc lỗi, không hiển thị variants
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.log("Không có variants hoặc API chưa sẵn sàng:", errorMessage);
    } finally {
      setLoadingVariants(false);
    }
  };

  // ===== SẢN PHẨM LIÊN QUAN =====
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products?limit=4`)
      .then((res) => setRelated(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===== ADD TO CART =====
  const addToCart = async () => {
    if (!product) return;

    const productId = product._id || product.id;
    const variantId = selectedVariant?._id || null;
    const price = selectedVariant?.price || product.price;
    const productName = selectedVariant 
      ? `${product.name} - ${selectedVariant.name}`
      : product.name;

    try {
      // Thử gọi API backend với variant_id
      await axios.post("http://localhost:3000/api/cart", {
        product_id: productId,
        variant_id: variantId,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
    } catch (error) {
      // Fallback về API cũ nếu backend chưa có
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.log("Fallback to old API:", errorMessage);
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
          name: productName,
          img: product.img,
          price: price,
          quantity,
        });
      }
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
                src={
                  selectedVariant?.images && selectedVariant.images.length > 0
                    ? selectedVariant.images[0]
                    : product.img
                }
                alt={product.name}
                style={{
                  width: "100%",
                  maxHeight: 420,
                  objectFit: "contain",
                }}
              />
            </CardContent>
          </Card>
          
          {/* Variant Images Gallery */}
          {selectedVariant?.images && selectedVariant.images.length > 1 && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {selectedVariant.images.map((img, index) => (
                <Box
                  key={index}
                  component="img"
                  src={img}
                  alt={`${product.name} - ${index + 1}`}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "2px solid transparent",
                    "&:hover": {
                      border: "2px solid #d70018",
                    },
                  }}
                />
              ))}
            </Box>
          )}
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
            <Box>
              <Typography
                variant="h4"
                sx={{ color: "#d70018", fontWeight: 700 }}
              >
                {(selectedVariant?.price || product.price).toLocaleString()}₫
              </Typography>
              {selectedVariant?.original_price && 
               selectedVariant.original_price > selectedVariant.price && (
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Typography
                    sx={{
                      textDecoration: "line-through",
                      color: "gray",
                      fontSize: "0.9rem",
                    }}
                  >
                    {selectedVariant.original_price.toLocaleString()}₫
                  </Typography>
                  <Chip
                    label={`Giảm ${Math.round(
                      ((selectedVariant.original_price - selectedVariant.price) /
                        selectedVariant.original_price) *
                        100
                    )}%`}
                    color="error"
                    size="small"
                  />
                </Stack>
              )}
              {product.discount && !selectedVariant && (
                <Chip
                  label={`Giảm ${product.discount}%`}
                  color="error"
                  sx={{ width: "fit-content", mt: 1 }}
                />
              )}
            </Box>

            {/* VARIANTS SELECTION */}
            {variants.length > 0 && (
              <Card sx={{ borderRadius: 3, bgcolor: "#f8f9fa" }}>
                <CardContent>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                      value={selectedVariant?._id || ""}
                      onChange={(e) => {
                        const variant = variants.find(
                          (v) => v._id === e.target.value
                        );
                        setSelectedVariant(variant || null);
                        setQuantity(1); // Reset quantity khi đổi variant
                      }}
                    >
                      {variants.map((variant) => (
                        <FormControlLabel
                          key={variant._id}
                          value={variant._id}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Typography>{variant.name}</Typography>
                              <Typography
                                sx={{
                                  color: "#d70018",
                                  fontWeight: 600,
                                  ml: "auto",
                                }}
                              >
                                {variant.price.toLocaleString()}₫
                              </Typography>
                              {variant.stock <= 0 && (
                                <Chip
                                  label="Hết hàng"
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1 }}
                                />
                              )}
                              {variant.stock > 0 && variant.stock <= 10 && (
                                <Chip
                                  label={`Còn ${variant.stock}`}
                                  size="small"
                                  color="warning"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                          disabled={variant.stock <= 0}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  
                  {selectedVariant && selectedVariant.attributes && 
                   Object.keys(selectedVariant.attributes).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" fontWeight={600} mb={1}>
                        Thông số:
                      </Typography>
                      {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                        <Typography key={key} fontSize={14} sx={{ mb: 0.5 }}>
                          <strong>{key}:</strong> {value}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}

            {/* STOCK WARNING */}
            {selectedVariant && selectedVariant.stock <= 0 && (
              <Alert severity="error">
                Biến thể này hiện đang hết hàng
              </Alert>
            )}
            {selectedVariant && 
             selectedVariant.stock > 0 && 
             selectedVariant.stock < quantity && (
              <Alert severity="warning">
                Chỉ còn {selectedVariant.stock} sản phẩm trong kho
              </Alert>
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
              <IconButton 
                onClick={decrease}
                disabled={
                  quantity <= 1 || 
                  (selectedVariant ? selectedVariant.stock <= 0 : false)
                }
              >
                <RemoveIcon />
              </IconButton>

              <TextField
                value={quantity}
                size="small"
                sx={{ width: 70 }}
                inputProps={{ 
                  style: { textAlign: "center" },
                  min: 1,
                  max: selectedVariant?.stock || undefined,
                }}
                type="number"
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  const maxStock = selectedVariant?.stock || Infinity;
                  setQuantity(Math.max(1, Math.min(value, maxStock)));
                }}
              />

              <IconButton 
                onClick={increase}
                disabled={
                  selectedVariant ? (
                    quantity >= selectedVariant.stock ||
                    selectedVariant.stock <= 0
                  ) : false
                }
              >
                <AddIcon />
              </IconButton>
              
              {selectedVariant && (
                <Typography variant="body2" color="gray" sx={{ ml: 1 }}>
                  Còn {selectedVariant.stock} sản phẩm
                </Typography>
              )}
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
                disabled={
                  (selectedVariant && selectedVariant.stock <= 0) ||
                  loadingVariants
                }
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
                disabled={
                  (selectedVariant && selectedVariant.stock <= 0) ||
                  loadingVariants
                }
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