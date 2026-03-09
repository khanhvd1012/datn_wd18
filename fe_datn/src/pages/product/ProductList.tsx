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
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const sub = queryParams.get("sub");

  const productsPerPage = 8;

  useEffect(() => {
    let url = "http://localhost:3000/products";
    if (category) url += `?category=${category}`;
    if (sub) url += `${category ? "&" : "?"}subCategory=${sub}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setPage(1);
      });
  }, [category, sub]);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    if (sortType === "priceAsc")
      sorted.sort((a, b) => a.price - b.price);
    if (sortType === "priceDesc")
      sorted.sort((a, b) => b.price - a.price);
    if (sortType === "soldDesc")
      sorted.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    return sorted;
  }, [products, sortType]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const displayedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

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

        {/* Header + Filter Box */}
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
                {products.length} sản phẩm
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <FormControl size="small">
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortType}
                  label="Sắp xếp"
                  onChange={(e) => setSortType(e.target.value)}
                >
                  <MenuItem value="default">Mặc định</MenuItem>
                  <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
                  <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
                  <MenuItem value="soldDesc">Bán chạy</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#d70018",
                  borderRadius: 2,
                  px: 3,
                }}
                onClick={() => navigate("/")}
              >
                Trang chủ
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {displayedProducts.map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #eee",
                  transition: "0.3s",
                  position: "relative",
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
                      top: 12,
                      left: 12,
                      background: "#d70018",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  />
                )}

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

                <CardContent>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      mb: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: 40,
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#d70018",
                      fontWeight: "bold",
                      fontSize: 17,
                    }}
                  >
                    {formatPrice(item.price)}
                  </Typography>

                  <Typography fontSize={12} color="gray" mt={0.5}>
                    Đã bán {item.sold ?? 0}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>

        {/* Pagination */}
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