import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  CircularProgress,
  Avatar,
  Container,
  Paper,
} from "@mui/material";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  images: string[];
  author: string;
  createdAt: string;
  views?: number;
}

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/news/${id}`);
        setNews(res.data);
      } catch (err) {
        console.error("Error fetching news detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" mb={3}>
          Bài viết không tồn tại
        </Typography>
        <MuiLink component={Link} to="/news" underline="hover">
          Quay lại tin tức
        </MuiLink>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 4 }}>
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{ color: "text.secondary" }}
        >
          Trang chủ
        </MuiLink>
        <MuiLink
          component={Link}
          to="/news"
          underline="hover"
          sx={{ color: "text.secondary" }}
        >
          Tin tức
        </MuiLink>
        <Typography color="text.primary">Chi tiết</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            lineHeight: 1.3,
          }}
        >
          {news.title}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            {news.author?.[0]?.toUpperCase() || "A"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {news.author}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(news.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}{" "}
              | {news.views || 0} lượt xem
            </Typography>
          </Box>
        </Box>

        {news.images?.[0] && (
          <Box
            component="img"
            src={news.images[0]}
            onError={(e: any) => {
              e.target.style.display = "none";
            }}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              mb: 4,
            }}
          />
        )}

        <Divider sx={{ mb: 4 }} />

        <Typography
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            "& p": { mb: 2 },
            "& img": { maxWidth: "100%", height: "auto", borderRadius: 2, my: 2 },
          }}
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <MuiLink component={Link} to="/news" underline="hover">
            ← Quay lại danh sách tin tức
          </MuiLink>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewsDetail;
