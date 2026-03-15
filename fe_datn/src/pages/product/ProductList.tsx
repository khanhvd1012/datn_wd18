import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Select,
  MenuItem,
  Pagination,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Breadcrumbs,
  TextField,
  Rating,
  IconButton,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";

import { Link, useLocation, useNavigate } from "react-router-dom";

interface Product {
  id: number;
  _id?: string;
  name: string;
  img: string;
  price: number;
  sold?: number;
  discount?: number;
  rating?: number;
  category?: string;
  subCategory?: string;
}

interface Variant {
  _id: string;
  price: number;
  original_price?: number;
  is_default?: boolean;
}

interface ProductWithVariants extends Product {
  displayPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  hasVariants?: boolean;
  variantCount?: number;
}

const ProductList = () => {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [sortType, setSortType] = useState("default");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const sub = queryParams.get("sub");

  const productsPerPage = 8;

  // ================= LẤY SẢN PHẨM VÀ VARIANTS =================
  useEffect(() => {
    const loadProductsWithVariants = async () => {
      try {
        let url = "http://localhost:3000/api/products";
        if (category) url += `?category=${category}`;
        if (sub) url += `${category ? "&" : "?"}subCategory=${sub}`;

        const res = await fetch(url);
        const data = await res.json();

        // Load variants cho từng sản phẩm
        const productsWithVariants = await Promise.all(
          data.map(async (product: Product) => {
            try {
              const productId = product._id || product.id;
              const variantsRes = await axios.get(
                `http://localhost:3000/api/variants/product/${productId}`
              );

              if (variantsRes.data?.variants && variantsRes.data.variants.length > 0) {
                const variants: Variant[] = variantsRes.data.variants;
                const defaultVariant = variants.find((v) => v.is_default) || variants[0];
                const prices = variants.map((v) => v.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);

                return {
                  ...product,
                  displayPrice: defaultVariant.price,
                  minPrice,
                  maxPrice,
                  hasVariants: true,
                  variantCount: variants.length,
                };
              }

              return {
                ...product,
                displayPrice: product.price,
                hasVariants: false,
              };
            } catch (error) {
              // Nếu không có variants hoặc API lỗi, dùng giá mặc định
              return {
                ...product,
                displayPrice: product.price,
                hasVariants: false,
              };
            }
          })
        );

        setProducts(productsWithVariants);
        setPage(1);
      } catch (error) {
        console.error("Lỗi load products:", error);
      }
    };

    loadProductsWithVariants();
  }, [category, sub]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  // ================= FILTER + SORT =================
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceFilter === "1") {
      filtered = filtered.filter((p) => p.price < 1000000);
    }

    if (priceFilter === "5") {
      filtered = filtered.filter(
        (p) => p.price >= 1000000 && p.price <= 5000000
      );
    }

    if (priceFilter === "10") {
      filtered = filtered.filter((p) => p.price > 5000000);
    }

    if (sortType === "priceAsc")
      filtered.sort(
        (a, b) =>
          (a.displayPrice || a.price) - (b.displayPrice || b.price)
      );

    if (sortType === "priceDesc")
      filtered.sort(
        (a, b) =>
          (b.displayPrice || b.price) - (a.displayPrice || a.price)
      );

    if (sortType === "soldDesc")
      filtered.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));

    return filtered;
  }, [products, sortType, search, priceFilter]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  // ================= ADD TO CART =================
  const addToCart = async (product: Product) => {
    const res = await fetch(
      `http://localhost:3000/cart?productId=${product.id}`
    );
    const data = await res.json();

    if (data.length > 0) {
      const item = data[0];

      await fetch(`http://localhost:3000/cart/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantity: item.quantity + 1,
        }),
      });
    } else {
      await fetch(`http://localhost:3000/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          img: product.img,
          price: product.price,
          quantity: 1,
        }),
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f2f4f7", py: 4 }}>
      <Box sx={{ maxWidth: "1300px", mx: "auto", px: 2 }}>

        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#666" }}>
            Trang chủ
          </Link>

          <Typography color="text.primary">
            {category ? decodeURIComponent(category) : "Tất cả sản phẩm"}
          </Typography>
        </Breadcrumbs>

        {/* HEADER */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: 3,
            p: 3,
            mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {category
                  ? decodeURIComponent(category)
                  : "TẤT CẢ SẢN PHẨM"}
              </Typography>

              <Typography fontSize={13} color="gray">
                {filteredProducts.length} sản phẩm
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} flexWrap="wrap">

              <TextField
                size="small"
                placeholder="Tìm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <FormControl size="small">
                <InputLabel>Giá</InputLabel>
                <Select
                  value={priceFilter}
                  label="Giá"
                  onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="1">Dưới 1 triệu</MenuItem>
                  <MenuItem value="5">1 - 5 triệu</MenuItem>
                  <MenuItem value="10">Trên 5 triệu</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortType}
                  label="Sắp xếp"
                  onChange={(e) => setSortType(e.target.value)}
                >
                  <MenuItem value="default">Mặc định</MenuItem>
                  <MenuItem value="priceAsc">Giá tăng</MenuItem>
                  <MenuItem value="priceDesc">Giá giảm</MenuItem>
                  <MenuItem value="soldDesc">Bán chạy</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                sx={{ backgroundColor: "#d70018" }}
                onClick={() => navigate("/")}
              >
                Trang chủ
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* GRID PRODUCT */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1,1fr)",
              sm: "repeat(2,1fr)",
              md: "repeat(3,1fr)",
              lg: "repeat(4,1fr)",
            },
            gap: 3,
          }}
        >
          {displayedProducts.map((item) => (
            <Card
              key={item.id}
              sx={{
                borderRadius: 3,
                border: "1px solid #eee",
                position: "relative",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  borderColor: "#d70018",
                },
              }}
            >
              {item.discount && (
                <Chip
                  label={`-${item.discount}%`}
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "#d70018",
                    color: "#fff",
                    fontWeight: 700,
                    zIndex: 1,
                  }}
                />
              )}

              {/* Badge nhiều biến thể */}
              {item.hasVariants && item.variantCount && item.variantCount > 1 && (
                <Chip
                  label={`${item.variantCount} biến thể`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: item.discount ? 50 : 10,
                    left: 10,
                    background: "#ff6a00",
                    color: "#fff",
                    fontSize: "0.7rem",
                    height: 22,
                    zIndex: 1,
                  }}
                />
              )}

              <IconButton
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                <FavoriteBorderIcon />
              </IconButton>

              <Link
                to={`/product/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <CardMedia
                  component="img"
                  image={item.img}
                  alt={item.name}
                  sx={{
                    height: 220,
                    objectFit: "contain",
                    backgroundColor: "#fafafa",
                    p: 3,
                  }}
                />
              </Link>

              <CardContent>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    mb: 1,
                    minHeight: 40,
                  }}
                >
                  {item.name}
                </Typography>

                <Rating
                  value={item.rating || 4}
                  precision={0.5}
                  readOnly
                  size="small"
                />

                {/* Hiển thị giá */}
                {item.hasVariants && item.minPrice !== item.maxPrice ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      sx={{
                        color: "#d70018",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      {formatPrice(item.minPrice || item.displayPrice || item.price)} - {formatPrice(item.maxPrice || item.displayPrice || item.price)}
                    </Typography>
                    <Typography fontSize={12} color="gray" sx={{ mt: 0.5 }}>
                      {item.variantCount} lựa chọn
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      color: "#d70018",
                      fontWeight: "bold",
                      fontSize: 17,
                      mt: 1,
                    }}
                  >
                    {formatPrice(item.displayPrice || item.price)}
                  </Typography>
                )}

                <Typography fontSize={12} color="gray" sx={{ mt: 0.5 }}>
                  Đã bán {item.sold ?? 0}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  sx={{ mt: 1.5, backgroundColor: "#d70018" }}
                  onClick={() => addToCart(item)}
                >
                  Thêm giỏ
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* PAGINATION */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size="large"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProductList;