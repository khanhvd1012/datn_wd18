import { useEffect, useState, useMemo } from "react";
import api from "../../services/api";

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
  Skeleton,
  Grid,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import SearchIcon from "@mui/icons-material/Search";

import { Link, useSearchParams, useNavigate } from "react-router-dom";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  img?: string;
  images?: string[];
  price: number;
  original_price?: number;
  category?: string;
  sold?: number;
  discount?: number;
  rating?: number;
  countInStock?: number;
}

const FALLBACK_IMAGE =
  "https://via.placeholder.com/200x200?text=No+Image";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("default");
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const productsPerPage = 12;

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const category = searchParams.get("category");
  const searchFromUrl = searchParams.get("search") || "";

  useEffect(() => {
    setSearch(searchFromUrl);
  }, [searchFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = "/products?";
        if (category) url += `category=${category}&`;
        if (searchFromUrl) url += `search=${searchFromUrl}&`;

        const res = await api.get(url);

        // Handle array or paginated object
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.docs || res.data.data || [];

        const mappedList = list.map((item: any) => ({
          ...item,
          id: item._id || item.id,
          img: item.images?.[0] || item.img || FALLBACK_IMAGE,
        }));

        setProducts(mappedList);
      } catch (err) {
        console.error("Lỗi load products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, searchFromUrl]);

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " đ";

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Client-side search filter
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Client-side sort
    if (sortType === "priceAsc") filtered.sort((a, b) => a.price - b.price);
    if (sortType === "priceDesc") filtered.sort((a, b) => b.price - a.price);

    return filtered;
  }, [products, search, sortType]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const addToCart = async (product: Product) => {
    try {
      await api.post("/cart", {
        productId: product._id || product.id,
        name: product.name,
        img: product.images?.[0] || product.img,
        price: product.price,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));
      setSnackbarMessage("Đã thêm sản phẩm vào giỏ hàng");
      setOpen(true);
    } catch (err) {
      console.error("Lỗi thêm vào giỏ:", err);
      setSnackbarMessage("Không thể thêm sản phẩm vào giỏ hàng");
      setOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", p: 3, background: "#fafafa" }}>
      {/* CATEGORY FILTER */}
      {category && (
        <Stack direction="row" spacing={2} mb={2}>
          <Chip
            label={`Danh mục: ${category}`}
            color="primary"
            onDelete={() => navigate("/products")}
          />
        </Stack>
      )}

      {/* SEARCH + SORT */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        mb={4}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          background: "#fff",
          padding: "18px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{
            width: { xs: "100%", md: 320 },
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
            width: 200,
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
          </Select>
        </FormControl>
      </Stack>

      {/* PRODUCT GRID */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Card sx={{ borderRadius: 3, p: 2 }}>
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" sx={{ mt: 2 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" sx={{ mt: 1 }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : displayedProducts.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Không tìm thấy sản phẩm nào
          </Typography>
          <Button variant="outlined" onClick={() => navigate("/products")}>
            Xem tất cả sản phẩm
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2,1fr)",
              sm: "repeat(3,1fr)",
              md: "repeat(4,1fr)",
            },
            gap: 3,
          }}
        >
          {displayedProducts.map((item) => (
            <Card
              key={item._id || item.id}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                background: "#fff",
                border: "1px solid #eee",
                position: "relative",
                transition: "all .3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
                },
              }}
            >
              {item.discount && (
                <Chip
                  label={`-${item.discount}%`}
                  color="error"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    fontWeight: "bold",
                  }}
                />
              )}

              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "#fff",
                }}
              >
                <FavoriteBorderIcon />
              </IconButton>

              <Link to={`/product/${item._id || item.id}`}>
                <CardMedia
                  component="img"
                  image={item.images?.[0] || item.img || FALLBACK_IMAGE}
                  onError={(e: any) => {
                    e.target.src = FALLBACK_IMAGE;
                  }}
                  sx={{
                    height: 200,
                    objectFit: "contain",
                    p: 2,
                    bgcolor: "#fafafa",
                  }}
                />
              </Link>

              <CardContent>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 500,
                    minHeight: 40,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {item.name}
                </Typography>

                <Rating value={item.rating || 4} readOnly size="small" />

                <Typography
                  sx={{
                    fontSize: 13,
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <LocalFireDepartmentIcon sx={{ fontSize: 16, color: "#ff6d00" }} />
                  Đã bán {item.sold || 0}
                </Typography>

                <Box mt={1}>
                  <Typography
                    sx={{
                      color: "#d70018",
                      fontWeight: 700,
                      fontSize: 18,
                    }}
                  >
                    {formatPrice(item.price)}
                  </Typography>
                  {item.original_price && item.original_price > item.price && (
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: "#999",
                        textDecoration: "line-through",
                      }}
                    >
                      {formatPrice(item.original_price)}
                    </Typography>
                  )}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{
                    mt: 1.5,
                    backgroundColor: "#d70018",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#b71c1c",
                    },
                  }}
                  onClick={() => addToCart(item)}
                >
                  Thêm vào giỏ
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
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

      {/* ALERT */}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductList;
