
import { useEffect, useMemo, useState } from "react";
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
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  content?: string;
  images: string[];
  author: string;
  createdAt: string;
  status?: string;
}

const FALLBACK_IMAGE =
  "https://via.placeholder.com/1200x600?text=Tin+tuc+cong+nghe";

const NewsPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/news", {
          params: { limit: 100, status: "published" },
        });
        const list = Array.isArray(res.data?.data) ? res.data.data : [];
        setNews(list);
      } catch (err) {
        console.error("Error fetching news:", err);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return news;
    return news.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        (item.excerpt || "").toLowerCase().includes(keyword),
    );
  }, [news, search]);

  const featured = filteredNews[0];
  const remainingNews = filteredNews.slice(1);
  const totalPages = Math.ceil(remainingNews.length / itemsPerPage) || 1;
  const displayedNews = remainingNews.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <Box sx={{ background: "#f6f8fc", minHeight: "100vh", py: 5 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Breadcrumbs sx={{ color: "#5f6b7a", mb: 3 }}>
          <MuiLink
            component={Link}
            to="/"
            sx={{ color: "#5f6b7a", textDecoration: "none" }}
          >
            Trang chủ
          </MuiLink>
          <Typography color="#1f2937">Tin tức</Typography>
        </Breadcrumbs>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ color: "#0f172a", fontWeight: 800 }}>
            Tin tức công nghệ
          </Typography>
          <TextField
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm bài viết..."
            size="small"
            sx={{ width: { xs: "100%", md: 320 }, bgcolor: "#fff" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {featured && (
          <Card
            sx={{
              mb: 4,
              borderRadius: 4,
              overflow: "hidden",
              border: "1px solid #e6ebf2",
              boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Grid container>
              <Grid size={{ xs: 12, md: 7 }}>
                <CardMedia
                  component="img"
                  image={featured.images?.[0] || FALLBACK_IMAGE}
                  alt={featured.title}
                  sx={{ height: { xs: 220, md: 360 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <CardContent sx={{ p: 3, height: "100%" }}>
                  <Chip
                    label="Bài nổi bật"
                    sx={{ mb: 2, bgcolor: "#e8f0ff", color: "#1d4ed8", fontWeight: 700 }}
                  />
                  <Typography
                    component={Link}
                    to={`/news/${featured._id}`}
                    sx={{
                      fontSize: 28,
                      fontWeight: 800,
                      lineHeight: 1.25,
                      color: "#111827",
                      textDecoration: "none",
                      "&:hover": { color: "#1d4ed8" },
                    }}
                  >
                    {featured.title}
                  </Typography>
                  <Typography sx={{ color: "#4b5563", mt: 2, mb: 2 }}>
                    {featured.excerpt}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, color: "#6b7280" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <PersonOutlineIcon fontSize="small" />
                      <Typography variant="body2">{featured.author || "Admin"}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <AccessTimeIcon fontSize="small" />
                      <Typography variant="body2">
                        {new Date(featured.createdAt).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        )}

        <Grid container spacing={3}>
          {displayedNews.map((item) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "#fff",
                  borderRadius: 3,
                  border: "1px solid #e8edf5",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(15,23,42,0.08)",
                  },
                }}
              >
                <Link to={`/news/${item._id}`} style={{ textDecoration: "none" }}>
                  <CardMedia
                    component="img"
                    height="220"
                    image={item.images?.[0] || FALLBACK_IMAGE}
                    alt={item.title}
                  />
                </Link>
                <CardContent>
                  <Typography
                    component={Link}
                    to={`/news/${item._id}`}
                    sx={{
                      color: "#0f172a",
                      fontWeight: 700,
                      fontSize: 20,
                      textDecoration: "none",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      "&:hover": { color: "#1d4ed8" },
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      mt: 1.5,
                      mb: 2,
                      minHeight: 66,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.excerpt}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", color: "#6b7280" }}>
                    <Typography variant="caption">Bởi: {item.author || "Admin"}</Typography>
                    <Typography variant="caption">
                      {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {displayedNews.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography color="text.secondary">Không tìm thấy bài viết phù hợp.</Typography>
          </Box>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default NewsPage;
