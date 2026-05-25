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
  countInStock?: number;
  variants: any[];
  images: string[];
  rating: number;
  reviews: number;
  is_active: boolean;
  createdAt: string;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23e0e0e0'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23777' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

const ProductList2 = () => {
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

  const categoryFromUrl = searchParams.get("category") || "";
  const searchFromUrl = searchParams.get("search") || "";

  // Đồng bộ state từ URL: khi URL đổi (kể cả khi xoá param), state reset theo.
  useEffect(() => {
    setSearch(searchFromUrl);
    setSelectedCategory(categoryFromUrl);
    setPage(1);
  }, [searchFromUrl, categoryFromUrl]);

  // Reset page về 1 mỗi khi đổi filter / sắp xếp / brand để tránh trang trống.
  useEffect(() => {
    setPage(1);
  }, [selectedBrand, sortType]);

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

  const getTotalStock = (product: Product) => {
    if (!product.variants || product.variants.length === 0) {
      return product.countInStock || 0;
    }
    return product.variants.reduce(
      (total, variant) => total + (variant.stock || variant.countInStock || 0),
      0
    );
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    const selectedCategoryName =
      categories.find((c) => c._id === selectedCategory)?.name?.toLowerCase() || "";

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(search.toLowerCase()) ||
          product.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => {
        // Backend hiện có thể trả category là id/object hoặc name string
        if (typeof product.category === "string") {
          const productCategoryValue = product.category.toLowerCase();
          return (
            productCategoryValue === selectedCategory.toLowerCase() ||
            (selectedCategoryName && productCategoryValue === selectedCategoryName)
          );
        }

        return product.category?._id === selectedCategory;
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
    setPage(1);
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
    setPage(1);
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
      minHeight: "100vh",
      backgroundColor: "#f5f5f7",
      py: 4,
    }}
  >
    <Box
      sx={{
        maxWidth: "1450px",
        mx: "auto",
        px: { xs: 2, md: 3 },
      }}
    >
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          color="#1f2937"
          mb={1}
        >
          Danh mục sản phẩm
        </Typography>

        <Typography color="text.secondary">
          Hiển thị {displayedProducts.length} / {filteredProducts.length} sản phẩm
        </Typography>
      </Box>

      {/* MAIN LAYOUT */}
      <Grid container spacing={3}>

        {/* LEFT FILTER */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card
            sx={{
              borderRadius: "24px",
              position: "sticky",
              top: 20,
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              border: "1px solid #eee",
            }}
          >
            <CardContent sx={{ p: 3 }}>

              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
              >
                Bộ lọc sản phẩm
              </Typography>

              <Stack spacing={3}>

                {/* SEARCH */}
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    mb={1}
                  >
                    Tìm kiếm
                  </Typography>

                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm sản phẩm..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "14px",
                        background: "#fafafa",
                      },
                    }}
                  />
                </Box>

                {/* CATEGORY */}
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    mb={1}
                  >
                    Danh mục
                  </Typography>

                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedCategory}
                      onChange={(e) =>
                        handleCategoryChange(e.target.value)
                      }
                      displayEmpty
                      sx={{
                        borderRadius: "14px",
                        background: "#fafafa",
                      }}
                    >
                      <MenuItem value="">
                        Tất cả danh mục
                      </MenuItem>

                      {categories.map((category) => (
                        <MenuItem
                          key={category._id}
                          value={category._id}
                        >
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* BRAND */}
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    mb={1}
                  >
                    Thương hiệu
                  </Typography>

                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setPage(1);
                      }}
                      displayEmpty
                      sx={{
                        borderRadius: "14px",
                        background: "#fafafa",
                      }}
                    >
                      <MenuItem value="">
                        Tất cả thương hiệu
                      </MenuItem>

                      {brands.map((brand) => (
                        <MenuItem
                          key={brand._id}
                          value={brand._id}
                        >
                          {brand.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* SORT */}
                <Box>
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    mb={1}
                  >
                    Sắp xếp
                  </Typography>

                  <FormControl fullWidth size="small">
                    <Select
                      value={sortType}
                      onChange={(e) => {
                        setSortType(e.target.value);
                        setPage(1);
                      }}
                      sx={{
                        borderRadius: "14px",
                        background: "#fafafa",
                      }}
                    >
                      <MenuItem value="default">
                        Mặc định
                      </MenuItem>

                      <MenuItem value="priceAsc">
                        Giá tăng dần
                      </MenuItem>

                      <MenuItem value="priceDesc">
                        Giá giảm dần
                      </MenuItem>

                      <MenuItem value="rating">
                        Đánh giá cao
                      </MenuItem>

                      <MenuItem value="newest">
                        Mới nhất
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT PRODUCTS */}
        <Grid size={{ xs: 12, lg: 9 }}>

          {/* LOADING */}
          {loading ? (
            <Card
              sx={{
                borderRadius: "24px",
                p: 6,
                textAlign: "center",
              }}
            >
              <Typography>
                Đang tải sản phẩm...
              </Typography>
            </Card>
          ) : displayedProducts.length === 0 ? (

            /* EMPTY */
            <Card
              sx={{
                borderRadius: "24px",
                p: 6,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                color="text.secondary"
              >
                Không tìm thấy sản phẩm
              </Typography>
            </Card>

          ) : (

            /* PRODUCT GRID */
            <Grid container spacing={3}>

              {displayedProducts.map((product) => (

                <Grid
                  key={product._id}
                  size={{ xs: 12, sm: 6, md: 4 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      borderRadius: "24px",
                      border: "1px solid #eee",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all .3s ease",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",

                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow:
                          "0 12px 30px rgba(0,0,0,0.12)",
                      },
                    }}
                  >

                    {/* IMAGE */}
                    <Box
                      sx={{
                        position: "relative",
                        height: 260,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                        background: "#fff",
                      }}
                    >
                      {/* FAVORITE */}
                      <IconButton
                        onClick={(e) =>
                          handleToggleFavorite(
                            e,
                            product._id
                          )
                        }
                        sx={{
                          position: "absolute",
                          top: 14,
                          right: 14,
                          background: "#fff",
                          boxShadow:
                            "0 4px 12px rgba(0,0,0,0.1)",

                          "&:hover": {
                            background: "#fff",
                          },
                        }}
                      >
                        {favorites.includes(product._id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>

                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            product.images?.[0] ||
                            FALLBACK_IMAGE
                          }
                          onError={(e: any) => {
                            e.target.src =
                              FALLBACK_IMAGE;
                          }}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            transition:
                              "transform .3s ease",

                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      </Link>
                    </Box>

                    {/* CONTENT */}
                    <CardContent
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 3,
                      }}
                    >
                      {/* BRAND */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1}
                      >
                        {getBrandName(product.brand)}
                      </Typography>

                      {/* NAME */}
                      <Link
                        to={`/product/${product._id}`}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 17,
                            lineHeight: 1.5,
                            minHeight: 52,

                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient:
                              "vertical",
                            overflow: "hidden",

                            "&:hover": {
                              color: "#1976d2",
                            },
                          }}
                        >
                          {product.name}
                        </Typography>
                      </Link>

                      {/* RATING */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        <Rating
                          value={product.rating || 0}
                          readOnly
                          size="small"
                        />

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          ml={1}
                        >
                          ({product.reviews || 0})
                        </Typography>
                      </Box>

                      {/* STOCK */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        {product.variants &&
                        product.variants.length > 0 ? (
                          <Chip
                            label={`${product.variants.length} phiên bản`}
                            size="small"
                          />
                        ) : (
                          <Box />
                        )}

                        <Typography
                          fontSize={13}
                          fontWeight={600}
                          color={
                            getTotalStock(product) > 0
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {getTotalStock(product) > 0
                            ? `Còn ${getTotalStock(
                                product
                              )} sp`
                            : "Hết hàng"}
                        </Typography>
                      </Box>

                      {/* PRICE */}
                      <Box sx={{ mt: "auto" }}>
                        <Typography
                          sx={{
                            color: "#d70018",
                            fontSize: 28,
                            fontWeight: 800,
                            lineHeight: 1.2,
                          }}
                        >
                          {product.variants &&
                          product.variants.length > 0
                            ? formatPrice(
                                getMinPrice(product)
                              )
                            : formatPrice(
                                product.price || 0
                              )}
                        </Typography>

                        {product.variants &&
                          product.variants.length >
                            0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              mt={0.5}
                            >
                              đến{" "}
                              {formatPrice(
                                getMaxPrice(product)
                              )}
                            </Typography>
                          )}

                        {/* BUTTONS */}
                        <Stack
                          direction="row"
                          spacing={1.5}
                          mt={3}
                        >
                          <Button
                            fullWidth
                            variant="outlined"
                            component={Link}
                            to={`/product/${product._id}`}
                            startIcon={
                              <VisibilityIcon />
                            }
                            sx={{
                              borderRadius: "14px",
                              textTransform: "none",
                              height: 46,
                              fontWeight: 600,
                            }}
                          >
                            Xem
                          </Button>

                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={
                              <ShoppingCartIcon />
                            }
                            onClick={() =>
                              handleAddToCart(product)
                            }
                            disabled={
                              getTotalStock(product) ===
                              0
                            }
                            sx={{
                              borderRadius: "14px",
                              textTransform: "none",
                              height: 46,
                              fontWeight: 600,
                              boxShadow: "none",
                            }}
                          >
                            Chọn
                          </Button>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 5,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) =>
                  setPage(value)
                }
                color="primary"
                size="large"
              />
            </Box>
          )}
        </Grid>
      </Grid>

      {/* NOTIFICATION */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
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
  </Box>
);
};

export default ProductList2;
