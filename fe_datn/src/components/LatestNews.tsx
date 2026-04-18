import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Button,
  Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import api from "../services/api";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  images: string[];
  author: string;
  createdAt: string;
}

const LatestNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await api.get("/news", {
          params: { status: "published", limit: 3 },
        });
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setNews(list.slice(0, 3));
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchLatestNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", px: 2, py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0f172a" }}>
          TIN TỨC MỚI NHẤT
        </Typography>
        <Button 
          component={Link} 
          to="/news" 
          sx={{ color: "#1d4ed8", fontWeight: 700 }}
        >
          Xem tất cả
        </Button>
      </Box>

      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid size={{ xs: 12, md: 4 }} key={item._id}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#fff",
                border: "1px solid #e8edf5",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 25px rgba(15,23,42,0.08)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="350"
                image={item.images[0] || "https://via.placeholder.com/400x200"}
                alt={item.title}
                sx={{
                  objectFit: "cover",
                  objectPosition: "center 35%",
                }}
              />
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#0f172a",
                    fontWeight: "bold",
                    mb: 1,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: 56
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: 60
                  }}
                >
                  {item.excerpt}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                  <Chip label="Tin mới" size="small" sx={{ bgcolor: "#e8f0ff", color: "#1d4ed8" }} />
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/news/${item._id}`}
                    sx={{ color: "#1d4ed8", fontWeight: 700 }}
                  >
                    Đọc tiếp
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LatestNews;
