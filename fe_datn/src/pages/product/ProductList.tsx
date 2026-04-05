import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Select,
  MenuItem,
  Pagination,
  Button,
  Stack,
  FormControl,
  InputLabel,
  TextField,
  Rating,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  InputAdornment,
  Grid,
  CardActions,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getFavoritesApi, toggleFavoriteApi } from "../../services/userService";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getAllProductsApi } from "../../services/productService";
import { addToCartApi } from "../../services/cartService";
import api from "../../services/api";

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string | { _id: string; name: string };
  category: string | { _id: string; name: string };
  price?: number;
  variants: any[];
  images: string[];
  rating: number;
  reviews: number;
  is_active: boolean;
  createdAt: string;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e0e0e0'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23777' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [open, setOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const productsPerPage = 12;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryFromUrl = searchParams.get("category");
  const searchFromUrl = searchParams.get("search") || "";

  useEffect(() => {
    setSearch(searchFromUrl);
    if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
  }, [searchFromUrl, categoryFromUrl]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products, categories, and brands
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          getAllProductsApi(),
          api.get("/categories"),
          api.get("/brands"),
        ]);

        setProducts(productsRes || []);
        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setNotification({
          open: true,
          message: "Không thể tải dữ liệu sản phẩm",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    if (localStorage.getItem("token")) {
      getFavoritesApi()
        .then(data => {
          if (Array.isArray(data)) {
            setFavorites(data.map((fav: any) => typeof fav === 'string' ? fav : fav._id));
          }
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleToggleFavorite = async (e: any, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!localStorage.getItem("token")) {
        setNotification({ open: true, message: "Vui lòng đăng nhập để yêu thích", severity: "warning" });
        return;
      }
      await toggleFavoriteApi(productId);
      if (favorites.includes(productId)) {
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        setFavorites([...favorites, productId]);
      }
    } catch (err: any) {
      setNotification({ open: true, message: err.response?.data?.message || "Lỗi khi xử lý", severity: "error" });
    }
  };

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " đ";

  const getBrandName = (brand: string | { _id: string; name: string }) => {
    if (typeof brand === "string") {
      const found = brands.find((b) => b._id === brand);
      return found ? found.name : brand;
    }
    return brand?.name || "";
  };

  const getCategoryName = (
    category: string | { _id: string; name: string },
  ) => {
    if (typeof category === "string") {
      const found = categories.find((c) => c._id === category);
      return found ? found.name : category;
    }
    return category?.name || "";
  };

  const getMinPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map((v) => v.price));
    }
    return product.price || 0;
  };

  const getMaxPrice = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      return Math.max(...product.variants.map((v) => v.price));
    }
    return product.price || 0;
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        const categoryId =
          typeof product.category === "string"
            ? product.category
            : product.category?._id;
        return categoryId === selectedCategory;
      });
    }

    // Filter by brand
    if (selectedBrand) {
      filtered = filtered.filter((product) => {
        const brandId =
          typeof product.brand === "string"
            ? product.brand
            : product.brand?._id;
        return brandId === selectedBrand;
      });
    }

    // Sort
    if (sortType === "priceAsc") {
      filtered.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    } else if (sortType === "priceDesc") {
      filtered.sort((a, b) => getMaxPrice(b) - getMaxPrice(a));
    } else if (sortType === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortType === "newest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    return filtered;
  }, [products, search, sortType, selectedCategory, selectedBrand]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  );

  const handleAddToCart = async (product: Product) => {
    try {
      // If product has variants, redirect to product detail
      if (product.variants && product.variants.length > 0) {
        navigate(`/product/${product._id}`);
        return;
      }

      // Add to cart
      await addToCartApi({
        product_id: product._id,
        quantity: 1,
      });

      // Update cart count in header
      window.dispatchEvent(new Event("cartUpdated"));

      setNotification({
        open: true,
        message: "Đã thêm sản phẩm vào giỏ hàng!",
        severity: "success",
      });
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      setNotification({
        open: true,
        message: error.response?.data?.message || "Không thể thêm vào giỏ hàng",
        severity: "error",
      });
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set("category", categoryId);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box
      sx={{
        maxWidth: 1300,
        mx: "auto",
        p: 3,
        background: "#fafafa",
        minHeight: "100vh",
      }}
    >
      {/* FILTERS */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={4}
        sx={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            width: { xs: "100%", md: 300 },
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl
          size="small"
          sx={{
            width: { xs: "100%", md: 200 },
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={selectedCategory}
            label="Danh mục"
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <MenuItem value="">Tất cả danh mục</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            width: { xs: "100%", md: 200 },
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <InputLabel>Thương hiệu</InputLabel>
          <Select
            value={selectedBrand}
            label="Thương hiệu"
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <MenuItem value="">Tất cả thương hiệu</MenuItem>
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            width: { xs: "100%", md: 200 },
            background: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            value={sortType}
            label="Sắp xếp"
            onChange={(e) => setSortType(e.target.value)}
          >
            <MenuItem value="default">Mặc định</MenuItem>
            <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
            <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
            <MenuItem value="rating">Đánh giá cao</MenuItem>
            <MenuItem value="newest">Mới nhất</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* LOADING STATE */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <Typography>Đang tải sản phẩm...</Typography>
        </Box>
      ) : (
        <>
          {/* RESULTS COUNT */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hiển thị {displayedProducts.length} / {filteredProducts.length} sản
            phẩm
          </Typography>

          {/* PRODUCT GRID */}
          {displayedProducts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy sản phẩm nào
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {displayedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={3} lg={3} key={product._id} sx={{ display: "flex" }}>
                  <Card
                    sx={{
                      width: "280px", // Chốt chết chiều rộng
                      height: "430px", 
                      mx: "auto", 
                      borderRadius: 3,
                      overflow: "hidden",
                      background: "#fff",
                      border: "1px solid #eee",
                      position: "relative",
                      transition: "all .3s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", height: 200, display: "flex", alignItems: "center", justifyContent: "center", overflow: 'hidden', p: 2 }}>
                      <IconButton
                        onClick={(e) => handleToggleFavorite(e, product._id)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          bgcolor: "rgba(255,255,255,0.8)",
                          zIndex: 1,
                        }}
                      >
                        {favorites.includes(product._id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>

                      <Link to={`/product/${product._id}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CardMedia
                          component="img"
                          image={product.images?.[0] || FALLBACK_IMAGE}
                          onError={(e: any) => {
                            e.target.src = FALLBACK_IMAGE;
                          }}
                          sx={{
                            maxHeight: "100%",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Link>
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        textAlign: "left"
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1, height: 20, overflow: 'hidden' }}
                      >
                        {getBrandName(product.brand)}
                      </Typography>

                      <Box sx={{ height: 48, overflow: 'hidden', mb: 1.5 }}>
                        <Link
                          to={`/product/${product._id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontSize: 16,
                              fontWeight: 600,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              "&:hover": {
                                color: "primary.main",
                              },
                            }}
                          >
                            {product.name}
                          </Typography>
                        </Link>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <Rating
                          value={product.rating || 0}
                          readOnly
                          size="small"
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({product.reviews || 0})
                        </Typography>
                      </Box>

                      <Box sx={{ mt: "auto" }}>
                        <Box sx={{ height: 24, mb: 1 }}>
                          {product.variants && product.variants.length > 0 ? (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {product.variants.length} phiên bản
                            </Typography>
                          ) : null}
                        </Box>

                        <Typography
                          sx={{
                            color: "#d70018",
                            fontWeight: 700,
                            fontSize: 18,
                            mb: 2,
                          }}
                        >
                          {product.variants && product.variants.length > 0
                            ? `${formatPrice(getMinPrice(product))} - ${formatPrice(getMaxPrice(product))}`
                            : formatPrice(product.price || 0)}
                        </Typography>

                        <CardActions sx={{ p: 0, gap: 1 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            component={Link}
                            to={`/product/${product._id}`}
                            sx={{
                              textTransform: "none",
                              flex: 1,
                            }}
                          >
                            Xem
                          </Button>
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => handleAddToCart(product)}
                            sx={{
                              textTransform: "none",
                              flex: 1,
                            }}
                          >
                            {product.variants && product.variants.length > 0
                              ? "Chọn"
                              : "Mua"}
                          </Button>
                        </CardActions>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* NOTIFICATION */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList;
