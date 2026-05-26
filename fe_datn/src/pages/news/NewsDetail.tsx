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
  Card,
  Chip,
  Container,
} from "@mui/material";

import DOMPurify from "dompurify";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  images?: string[] | null;
  author?: string;
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
        setNews(res.data.data || res.data);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff6a00" }} />
      </Box>
    );
  }

  // Not found
  if (!news) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f5f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: "#111",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Bài viết không tồn tại
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#f5f7fb",
        minHeight: "100vh",
        pb: 10,
      }}
    >
      {/* HERO BANNER */}
      {news.images?.[0] && (
        <Box
          sx={{
            width: "100%",
            height: { xs: "35vh", md: "60vh" },
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={news.images[0]}
            alt={news.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(245,247,251,1))",
            }}
          />
        </Box>
      )}

      {/* CONTENT */}
      <Container maxWidth="md">
        <Card
          sx={{
            mt: news.images?.[0] ? -12 : 6,
            position: "relative",
            zIndex: 2,
            borderRadius: 6,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid #ececec",
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 6 },
            }}
          >
            {/* Breadcrumb */}
            <Breadcrumbs sx={{ mb: 4 }}>
              <MuiLink
                component={Link}
                to="/"
                underline="hover"
                sx={{
                  color: "#777",
                  fontWeight: 500,
                }}
              >
                Trang chủ
              </MuiLink>

              <MuiLink
                component={Link}
                to="/news"
                underline="hover"
                sx={{
                  color: "#777",
                  fontWeight: 500,
                }}
              >
                Tin tức
              </MuiLink>

              <Typography
                sx={{
                  color: "#ff6a00",
                  fontWeight: 600,
                }}
              >
                Chi tiết
              </Typography>
            </Breadcrumbs>

            {/* Category */}
            <Chip
              label="NEWS"
              sx={{
                mb: 3,
                background: "#fff3eb",
                color: "#ff6a00",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            />

            {/* TITLE */}
            <Typography
              variant="h2"
              sx={{
                color: "#111",
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 4,
                fontSize: {
                  xs: "2rem",
                  md: "3.5rem",
                },
              }}
            >
              {news.title}
            </Typography>

            {/* AUTHOR */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 5,
              }}
            >
              <Avatar
                sx={{
                  width: 55,
                  height: 55,
                  bgcolor: "#ff6a00",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                {news.author?.[0]?.toUpperCase() || "A"}
              </Avatar>

              <Box>
                <Typography
                  sx={{
                    color: "#111",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {news.author || "Admin"}
                </Typography>

                <Typography
                  sx={{
                    color: "#777",
                    fontSize: "0.95rem",
                  }}
                >
                  {new Date(news.createdAt).toLocaleDateString("vi-VN")} •{" "}
                  {news.views || 0} lượt xem
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                mb: 5,
                borderColor: "#ececec",
              }}
            />

            {/* CONTENT */}
            <Box
              sx={{
                color: "#333",
                fontSize: "1.1rem",
                lineHeight: 2,

                "& p": {
                  mb: 3,
                },

                "& img": {
                  width: "100%",
                  borderRadius: 4,
                  my: 4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                },

                "& h1, & h2, & h3": {
                  color: "#111",
                  fontWeight: 800,
                  mt: 5,
                  mb: 3,
                  lineHeight: 1.4,
                },

                "& ul, & ol": {
                  pl: 4,
                  mb: 3,
                },

                "& li": {
                  mb: 1,
                },

                "& blockquote": {
                  borderLeft: "4px solid #ff6a00",
                  pl: 3,
                  py: 1,
                  my: 4,
                  color: "#555",
                  background: "#fff7f2",
                  borderRadius: 2,
                },

                "& a": {
                  color: "#ff6a00",
                  fontWeight: 600,
                  textDecoration: "none",
                },
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(news.content || ""),
              }}
            />
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default NewsDetail;