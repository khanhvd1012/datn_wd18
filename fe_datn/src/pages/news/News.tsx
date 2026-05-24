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
  Chip,
  Stack,
  Container,
  Fade,
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
    api
      .get("/news")
      .then((res) => setNews(res.data.data || res.data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  const totalPages = Math.ceil(news.length / itemsPerPage);

  const displayedNews = news.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box
      sx={{
        background: "#f8fafc",
        minHeight: "100vh",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <MuiLink
            component={Link}
            to="/"
            underline="hover"
            sx={{
              color: "#64748b",
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            Trang chủ
          </MuiLink>

          <Typography
            sx={{
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Tin tức
          </Typography>
        </Breadcrumbs>

        {/* Hero */}
        <Box
          sx={{
            mb: 5,
            borderRadius: "28px",
            p: { xs: 3, md: 5 },
            background:
              "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)",
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 40px rgba(15,23,42,0.04)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#0f172a",
              mb: 1.5,
              fontSize: { xs: 28, md: 42 },
              letterSpacing: "-1px",
            }}
          >
            Tin tức công nghệ
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              maxWidth: 700,
              lineHeight: 1.8,
              fontSize: 16,
            }}
          >
            Cập nhật xu hướng mới nhất về công nghệ, AI, lập trình và
            các sản phẩm số hiện đại.
          </Typography>
        </Box>

        {/* NEWS LIST */}
        <Stack spacing={3}>
          {displayedNews.map((item, index) => (
            <Fade in timeout={300 + index * 100} key={item._id}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  overflow: "hidden",
                  borderRadius: "26px",
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
                  transition: "all .3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
                  },
                }}
              >
                {/* IMAGE LEFT */}
                <Box
                  component={Link}
                  to={`/news/${item._id}`}
                  sx={{
                    width: { xs: "100%", md: 340 },
                    minWidth: { md: 340 },
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={
                      item.images[0] ||
                      "https://via.placeholder.com/400x240"
                    }
                    alt={item.title}
                    sx={{
                      width: "100%",
                      height: { xs: 240, md: "100%" },
                      objectFit: "cover",
                      transition: "0.5s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />
                </Box>

                {/* CONTENT RIGHT */}
                <CardContent
                  sx={{
                    flex: 1,
                    p: { xs: 3, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    {/* TOP */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Chip
                        label="Công nghệ"
                        size="small"
                        sx={{
                          bgcolor: "#eff6ff",
                          color: "#2563eb",
                          fontWeight: 700,
                          borderRadius: "8px",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 13,
                          color: "#94a3b8",
                        }}
                      >
                        📅{" "}
                        {new Date(item.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Typography>
                    </Stack>

                    {/* TITLE */}
                    <Typography
                      component={Link}
                      to={`/news/${item._id}`}
                      sx={{
                        textDecoration: "none",
                        color: "#0f172a",
                        fontWeight: 800,
                        fontSize: { xs: 22, md: 28 },
                        lineHeight: 1.4,
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        transition: ".2s",
                        "&:hover": {
                          color: "#2563eb",
                        },
                      }}
                    >
                      {item.title}
                    </Typography>

                    {/* EXCERPT */}
                    <Typography
                      sx={{
                        color: "#64748b",
                        lineHeight: 1.9,
                        fontSize: 15,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.excerpt}
                    </Typography>
                  </Box>

                  {/* FOOTER */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      ✍ {item.author}
                    </Typography>

                    <Typography
                      component={Link}
                      to={`/news/${item._id}`}
                      sx={{
                        textDecoration: "none",
                        color: "#2563eb",
                        fontWeight: 700,
                        fontSize: 14,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Xem chi tiết →
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Stack>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 6,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "12px",
                  fontWeight: 600,
                  color: "#475569",
                },

                "& .Mui-selected": {
                  backgroundColor: "#2563eb !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NewsPage;