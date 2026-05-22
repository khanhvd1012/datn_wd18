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
    <Box sx={{ background: "#ffffff", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ color: "#999", mb: 3 }}>
          <MuiLink component={Link} to="/" sx={{ color: "#999" }}>
            Trang chủ
          </MuiLink>
          <Typography color="#aaa">Tin tức</Typography>
        </Breadcrumbs>

        {/* Hero Header */}
        <Box
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 4,
            background: "linear-gradient(135deg, #ffffff, #ffffff)",
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: "#aaa", fontWeight: 800, mb: 1 }}
          >
            Tin tức công nghệ
          </Typography>
          <Typography sx={{ color: "#aaa", maxWidth: 600 }}>
            Cập nhật những xu hướng mới nhất về công nghệ, lập trình, AI và
            sản phẩm số.
          </Typography>
        </Box>

        {/* Grid */}
        <Grid container spacing={3}>
          {displayedNews.map((item, index) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: 4,
                    border: "1px solid #222",
                    overflow: "hidden",
                    transition: "0.3s",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "#ff6a00",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  <Link to={`/news/${item._id}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={
                        item.images[0] ||
                        "https://via.placeholder.com/400x240"
                      }
                      alt={item.title}
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                  </Link>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {/* Tag */}
                    <Stack direction="row" spacing={1}>
                      <Chip
                        label="Công nghệ"
                        size="small"
                        sx={{
                          background: "#ff6a00",
                          color: "#8e8b8b",
                          fontSize: 12,
                        }}
                      />
                    </Stack>

                    {/* Title */}
                    <Typography
                      component={Link}
                      to={`/news/${item._id}`}
                      sx={{
                        color: "#c3bebe",
                        fontWeight: 700,
                        fontSize: 18,
                        textDecoration: "none",
                        lineHeight: 1.4,
                        "&:hover": { color: "#ff6a00" },
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.title}
                    </Typography>

                    {/* Excerpt */}
                    <Typography
                      sx={{
                        color: "#aaa",
                        fontSize: 14,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.excerpt}
                    </Typography>

                    {/* Footer */}
                    <Box
                      sx={{
                        mt: "auto",
                        pt: 2,
                        borderTop: "1px solid #222",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ color: "#777", fontSize: 12 }}>
                        ✍ {item.author}
                      </Typography>
                      <Typography sx={{ color: "#777", fontSize: 12 }}>
                        📅{" "}
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#9a9898",
                  borderColor: "#333",
                },
                "& .Mui-selected": {
                  backgroundColor: "#ff6a00 !important",
                  color: "#767373",
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