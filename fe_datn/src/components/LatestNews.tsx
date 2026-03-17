import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";

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
    fetch("http://localhost:3000/api/news")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.docs || data.data || []);
        setNews(list.slice(0, 3));
      })
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  if (news.length === 0) return null;

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto", px: 2, py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>
          TIN TỨC MỚI NHẤT
        </Typography>
        <Button 
          component={Link} 
          to="/news" 
          sx={{ color: "#ff6a00" }}
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
                backgroundColor: "#1a1a1a",
                border: "1px solid #333",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "#ff6a00",
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.images[0] || "https://via.placeholder.com/400x200"}
                alt={item.title}
              />
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#fff",
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
                    color: "#aaa",
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
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                  <Button 
                    size="small" 
                    component={Link} 
                    to={`/news/${item._id}`}
                    sx={{ color: "#ff6a00" }}
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
