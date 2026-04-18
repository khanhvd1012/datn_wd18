import { useEffect, useState } from "react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => {
        // Handle array or paginated object
        const list = Array.isArray(data) ? data : data.docs || data.data || [];

        // Map data to match local interface if needed
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
      })
      .catch((err) => console.error("Lỗi load products:", err));
  }, []);

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " đ";

  return (
    <Box sx={{ backgroundColor: "#ffffff", py: 4 }}>
      {/* Container */}
      <Box
        sx={{
          maxWidth: "1300px",
          margin: "auto",
          px: 2,
        }}
      >
        {/* HEADER */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box
            sx={{
              backgroundColor: "#1976d2", // Changed to blue to match banner theme
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
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)", // 4 cột cho cả màn hình trung bình
              lg: "repeat(4, 1fr)", 
            },
            gap: 2,
          }}
        >
          {products.slice(0, 8).map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  width: "280px", // Chốt chết chiều rộng
                  height: "380px", 
                  mx: "auto", 
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  "&:hover": {
                    borderColor: "#1976d2",
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={item.img}
                    alt={item.name}
                    sx={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ height: 40, overflow: 'hidden', mb: 1 }}>
                    <Typography
                      variant="body2"
                      title={item.name}
                      sx={{
                        color: "#1a1a1a",
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.4
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      color: "#d70018",
                      fontWeight: "bold",
                      fontSize: 16,
                      mt: "auto" // Đẩy giá xuống đáy CardContent
                    }}
                  >
                    {formatPrice(item.price)}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FeaturedProducts;
