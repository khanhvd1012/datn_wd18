import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Pagination,
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

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    api.get("/news")
      .then((res) => setNews(res.data.data || res.data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const displayedNews = news.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <Box sx={{ background: "#111", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Breadcrumbs sx={{ color: "#aaa", mb: 4 }}>
          <MuiLink
            component={Link}
            to="/"
            sx={{ color: "#aaa", textDecoration: "none" }}
          >
            Trang chủ
          </MuiLink>
          <Typography color="#fff">Tin tức</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          sx={{ color: "#fff", fontWeight: "bold", mb: 4 }}
        >
          TIN TỨC CÔNG NGHỆ
        </Typography>

        <Grid container spacing={4}>
          {displayedNews.map((item) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  transition: "0.3s",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    borderColor: "#ff6a00",
                  },
                }}
              >
                <Link
                  to={`/news/${item._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <CardMedia
                    component="img"
                    height="240"
                    image={
                      item.images[0] || "https://via.placeholder.com/400x240"
                    }
                    alt={item.title}
                  />
                </Link>
                <CardContent
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
                >
                  <Typography
                    variant="h6"
                    component={Link}
                    to={`/news/${item._id}`}
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      textDecoration: "none",
                      mb: 2,
                      "&:hover": { color: "#ff6a00" },
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
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
                    }}
                  >
                    {item.excerpt}
                  </Typography>
                  <Box
                    sx={{
                      mt: "auto",
                      pt: 2,
                      borderTop: "1px solid #333",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Bởi: {item.author}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#fff",
                  borderColor: "#333",
                },
                "& .Mui-selected": {
                  backgroundColor: "#ff6a00 !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NewsPage;
