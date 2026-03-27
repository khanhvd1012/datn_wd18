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
  Skeleton,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";

interface NewsItem {
  _id: string;
  title: string;
  excerpt?: string;
  content?: string;
  images: string[];
  author: string;
  createdAt: string;
}

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/news");
        setNews(Array.isArray(res.data) ? res.data : res.data.docs || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const displayedNews = news.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ color: "text.secondary", textDecoration: "none" }}
        >
          Trang chủ
        </MuiLink>
        <Typography color="text.primary">Tin tức</Typography>
      </Breadcrumbs>

      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        TIN TỨC MỚI NHẤT
      </Typography>

      {loading ? (
        <Grid container spacing={4}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} md={6} lg={4} key={i}>
              <Card>
                <Skeleton variant="rectangular" height={240} />
                <CardContent>
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : displayedNews.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            Chưa có bài viết nào
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {displayedNews.map((item) => (
              <Grid item xs={12} md={6} lg={4} key={item._id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 4,
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
                        item.images?.[0] || "https://via.placeholder.com/400x240?text=No+Image"
                      }
                      alt={item.title}
                      onError={(e: any) => {
                        e.target.src = "https://via.placeholder.com/400x240?text=No+Image";
                      }}
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
                        fontWeight: "bold",
                        textDecoration: "none",
                        color: "text.primary",
                        mb: 2,
                        "&:hover": { color: "primary.main" },
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
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.excerpt || item.content?.substring(0, 150) || ""}
                    </Typography>
                    <Box
                      sx={{
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Tác giả: {item.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default NewsPage;
