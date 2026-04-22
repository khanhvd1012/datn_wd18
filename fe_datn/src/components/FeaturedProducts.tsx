import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { addToCartApi, type CartItem } from "../services/cartService";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<CartItem[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.docs || data.data || [];

        const mappedList = list.map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          img:
            item.img ||
            (item.images && item.images[0]) ||
            "https://via.placeholder.com/200",
          price: item.price,
        }));

        setProducts(mappedList);
      });
  }, []);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  const handleAddToCart = async (productId: number) => {
    try {
      if (!localStorage.getItem("token")) {
        setNotification({
          open: true,
          message: "Vui lòng đăng nhập",
          severity: "warning",
        });
        navigate("/login");
        return;
      }

      setLoadingId(productId);

      await addToCartApi({
        product_id: productId,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));

      setNotification({
        open: true,
        message: "Đã thêm vào giỏ hàng!",
        severity: "success",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1300, mx: "auto", px: 2 }}>
        {/* HEADER */}
        <Box sx={{ display: "flex", mb: 3 }}>
          <Box
            sx={{
              background: "#1976d2",
              color: "#fff",
              px: 5,
              py: 1,
              fontWeight: "bold",
              fontSize: 18,
              clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
            }}
          >
            PHỤ KIỆN NỔI BẬT
          </Box>
        </Box>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {products.slice(0, 8).map((item) => (
            <Card
              key={item.id}
              sx={{
                width: 280,
                height: 380,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                },
              }}
            >
              {/* IMAGE - CLICK GO DETAIL */}
            <Box
              sx={{
                height: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
              }}
            >
              <Link
                to={`/product/${item.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
              >
                <CardMedia
                  component="img"
                  image={item.img}
                  alt={item.name}
                  sx={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                />
              </Link>
            </Box>

              {/* CONTENT + HOVER AREA ONLY HERE */}
              <CardContent
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                sx={{
                  position: "relative",
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.name}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#d70018",
                      fontWeight: "bold",
                      mt: 1,
                    }}
                  >
                    {formatPrice(item.price)}
                  </Typography>
                </Box>

                {/* HOVER BUTTONS ONLY IN CONTENT AREA */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "rgba(208, 208, 208, 0.75)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    py: 2,

                    opacity: hoveredId === item.id ? 1 : 0,
                    transform:
                      hoveredId === item.id
                        ? "translateY(0)"
                        : "translateY(20px)",
                    transition: "0.25s ease",
                    pointerEvents:
                      hoveredId === item.id ? "auto" : "none",
                  }}
                >
                  <Box
                    onClick={() =>
                      (window.location.href = `/product/${item.id}`)
                    }
                    sx={{
                      background: "#ff0000",
                      color: "#fff",
                      px: 2,
                      py: 0.8,
                      borderRadius: 2,
                      width: 140,
                      textAlign: "center",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Mua ngay
                  </Box>

                  <Box
                    onClick={() => handleAddToCart(item.id)}
                    sx={{
                      background: "#1976d2",
                      color: "#fff",
                      px: 2,
                      py: 0.8,
                      borderRadius: 2,
                      width: 140,
                      textAlign: "center",
                      fontWeight: 600,
                      cursor: "pointer",
                      opacity: loadingId === item.id ? 0.6 : 1,
                    }}
                  >
                    {loadingId === item.id
                      ? "Đang thêm..."
                      : "Thêm vào giỏ"}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* NOTIFICATION */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() =>
          setNotification((p) => ({ ...p, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeaturedProducts;