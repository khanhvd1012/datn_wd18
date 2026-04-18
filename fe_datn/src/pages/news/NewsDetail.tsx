
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  CircularProgress,
  Avatar,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import api from "../../services/api";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
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
    const fetchNewsDetail = async () => {
      try {
        const res = await api.get(`/news/${id}`);
        const data = res.data;
        setNews({
          ...data,
          author:
            typeof data.author === "string"
              ? data.author
              : data.author?.username || "Admin",
        });
      } catch (err) {
        console.error("Error fetching news detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#111" }}>
        <CircularProgress sx={{ color: "#ff6a00" }} />
      </Box>
    );
  }

  if (!news) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#111" }}>
        <Typography color="#fff">Bài viết không tồn tại</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#f6f8fc", minHeight: "100vh", pb: 10 }}>
      {news.images?.[0] && (
        <Box
          sx={{
            width: "100%",
            height: { xs: 220, md: 360 },
            backgroundImage: `url(${news.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <Box sx={{ maxWidth: 980, mx: "auto", px: 2, mt: news.images?.[0] ? -6 : 4, position: "relative" }}>
        <Box
          sx={{
            backgroundColor: "#fff",
            border: "1px solid #e8edf5",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 15px 40px rgba(2, 6, 23, 0.08)",
          }}
        >
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Breadcrumbs sx={{ color: "#64748b", mb: 3 }}>
              <MuiLink component={Link} to="/" sx={{ color: "#64748b", textDecoration: "none" }}>
                Trang chủ
              </MuiLink>
              <MuiLink component={Link} to="/news" sx={{ color: "#64748b", textDecoration: "none" }}>
                Tin tức
              </MuiLink>
              <Typography color="#1d4ed8" sx={{ display: { xs: "none", sm: "block" } }}>Chi tiết</Typography>
            </Breadcrumbs>

            <Chip label="Tin tức" sx={{ mb: 2, bgcolor: "#e8f0ff", color: "#1d4ed8", fontWeight: 700 }} />
            <Typography
              variant="h3"
              sx={{
                color: "#0f172a",
                fontWeight: 800,
                mb: 2,
                lineHeight: 1.2,
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              {news.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
              <Avatar sx={{ bgcolor: "#1d4ed8" }}>{news.author?.[0]?.toUpperCase() || "A"}</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#0f172a", fontWeight: 700 }}>{news.author}</Typography>
                <Box sx={{ display: "flex", gap: 2, color: "#64748b", mt: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    <Typography variant="caption">
                      {new Date(news.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PersonOutlineIcon fontSize="small" />
                    <Typography variant="caption">{news.views || 0} lượt xem</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "#e8edf5", mb: 4 }} />

            <Typography
              sx={{
                color: "#1f2937",
                fontSize: "1.05rem",
                lineHeight: 1.8,
                "& p": { mb: 2 },
                "& h1, & h2, & h3": { color: "#0f172a", mt: 2, mb: 1.5 },
                "& img": { maxWidth: "100%", height: "auto", borderRadius: 2, my: 2 },
              }}
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewsDetail;
