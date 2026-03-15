import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

interface Product {
  id: number;
  _id?: string;
  name: string;
  img: string;
  price: number;
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

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ProductWithVariants[]>([]);

  // Load variants cho mỗi sản phẩm
  useEffect(() => {
    const loadProductsWithVariants = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();
        
        // Load variants cho từng sản phẩm
        const productsWithVariants = await Promise.all(
          data.slice(0, 5).map(async (product: Product) => {
            try {
              const productId = product._id || product.id;
              const variantsRes = await axios.get(
                `http://localhost:3000/api/variants/product/${productId}`
              );
              
              if (variantsRes.data?.variants && variantsRes.data.variants.length > 0) {
                const variants: Variant[] = variantsRes.data.variants;
                const defaultVariant = variants.find(v => v.is_default) || variants[0];
                const prices = variants.map(v => v.price);
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
              
              return { ...product, displayPrice: product.price, hasVariants: false };
            } catch (error) {
              // Nếu không có variants hoặc API lỗi, dùng giá mặc định
              return { ...product, displayPrice: product.price, hasVariants: false };
            }
          })
        );
        
        setProducts(productsWithVariants);
      } catch (err) {
        console.error("Lỗi load products:", err);
      }
    };

    loadProductsWithVariants();
  }, []);

  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  return (
    <Box sx={{ backgroundColor: "#111", py: 4 }}>
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
              backgroundColor: "#ff6a00",
              color: "#fff",
              px: 5,
              py: 1,
              fontWeight: "bold",
              fontSize: 18,
              clipPath:
                "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
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
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)", // 5 sản phẩm / 1 hàng
            },
            gap: 2,
          }}
        >
          {products.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              to={`/product/${item.id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  height: "100%",
                  transition: "0.3s",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover": {
                    borderColor: "#ff6a00",
                    transform: "translateY(-6px)",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                  },
                }}
              >
                {/* Badge nhiều biến thể */}
                {item.hasVariants && item.variantCount && item.variantCount > 1 && (
                  <Chip
                    label={`${item.variantCount} biến thể`}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "#ff6a00",
                      color: "#fff",
                      fontSize: "0.7rem",
                      height: 20,
                      zIndex: 1,
                    }}
                  />
                )}

                <CardMedia
                  component="img"
                  image={item.img}
                  alt={item.name}
                  sx={{
                    height: 200,
                    objectFit: "contain",
                    backgroundColor: "#fff",
                    p: 2,
                  }}
                />

                <CardContent>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#eee",
                      minHeight: 48,
                      mb: 1,
                    }}
                  >
                    {item.name}
                  </Typography>

                  {/* Hiển thị giá */}
                  {item.hasVariants && item.minPrice !== item.maxPrice ? (
                    <Box>
                      <Typography
                        sx={{
                          color: "#ff3b3b",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        {formatPrice(item.minPrice || item.displayPrice || item.price)} - {formatPrice(item.maxPrice || item.displayPrice || item.price)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#999",
                          fontSize: 12,
                          mt: 0.5,
                        }}
                      >
                        {item.variantCount} lựa chọn
                      </Typography>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        color: "#ff3b3b",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      {formatPrice(item.displayPrice || item.price)}
                    </Typography>
                  )}
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