<<<<<<< HEAD

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  CircularProgress,
  Avatar
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
    fetch(`http://localhost:3000/api/news/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news detail:", err);
        setLoading(false);
      });
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
    <Box sx={{ background: "#111", minHeight: "100vh", pb: 10 }}>
      {/* Feature Image Header */}
      {news.images[0] && (
        <Box 
          sx={{ 
            width: "100%", 
            height: "40vh", 
            backgroundImage: `url(${news.images[0]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)"
            }
          }}
        />
      )}

      <Box sx={{ maxWidth: 900, mx: "auto", px: 2, mt: news.images[0] ? -10 : 4, position: "relative", zIndex: 2 }}>
        <Card sx={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: 4, overflow: "hidden" }}>
          <Box sx={{ p: { xs: 3, md: 6 } }}>
            <Breadcrumbs sx={{ color: "#aaa", mb: 3 }}>
              <MuiLink component={Link} to="/" sx={{ color: "#aaa", textDecoration: "none" }}>
                Trang chủ
              </MuiLink>
              <MuiLink component={Link} to="/news" sx={{ color: "#aaa", textDecoration: "none" }}>
                Tin tức
              </MuiLink>
              <Typography color="#ff6a00" sx={{ display: { xs: "none", sm: "block" } }}>Chi tiết</Typography>
            </Breadcrumbs>

            <Typography variant="h3" sx={{ color: "#fff", fontWeight: "bold", mb: 4, lineHeight: 1.2, fontSize: { xs: "2rem", md: "3rem" } }}>
              {news.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Avatar sx={{ bgcolor: "#ff6a00" }}>{news.author[0].toUpperCase()}</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#fff" }}>{news.author}</Typography>
                <Typography variant="caption" sx={{ color: "#aaa" }}>
                  Ngày đăng: {new Date(news.createdAt).toLocaleDateString("vi-VN")} | {news.views || 0} lượt xem
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "#333", mb: 4 }} />

            <Typography 
              sx={{ 
                color: "#eee", 
                fontSize: "1.1rem", 
                lineHeight: 1.8,
                "& p": { mb: 2 },
                "& img": { maxWidth: "100%", height: "auto", borderRadius: 2, my: 2 }
              }}
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

// Simple Card container for the content
const Card = ({ children, sx }: any) => (
    <Box sx={{ ...sx }}>{children}</Box>
);

export default NewsDetail;
=======
import React from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box
} from "@mui/material";

/* DATA */

const news = [
  {
    id: 1,
    title: "iPhone 16 sắp ra mắt",
    img: "https://picsum.photos/900/500?1",
    date: "12/03/2026",
    desc: "Apple chuẩn bị ra mắt iPhone thế hệ mới với nhiều nâng cấp AI và camera.",
    content:
      "Apple được cho là sẽ ra mắt iPhone 16 với chip mới mạnh hơn, camera cải tiến và nhiều tính năng AI."
  },
  {
    id: 2,
    title: "Samsung Galaxy S mới",
    img: "https://picsum.photos/900/500?2",
    date: "10/03/2026",
    desc: "Samsung giới thiệu dòng Galaxy mới.",
    content:
      "Samsung tiếp tục nâng cấp dòng Galaxy S với màn hình AMOLED và hiệu năng mạnh mẽ."
  }
];

const NewsDetail: React.FC = () => {

  const { id } = useParams();

  const article = news.find(
    (item) => item.id === Number(id)
  );

  if (!article) {
    return <Typography>Không tìm thấy bài viết</Typography>;
  }

  return (

<Container sx={{ py:6 }}>

<Typography
variant="h3"
fontWeight="bold"
mb={2}
>
{article.title}
</Typography>

<Typography
color="text.secondary"
mb={3}
>
{article.date}
</Typography>

<Box
component="img"
src={article.img}
width="100%"
sx={{
borderRadius:2,
mb:3
}}
/>

<Typography
variant="body1"
lineHeight={1.7}
>
{article.content}
</Typography>

</Container>

  );
};

export default NewsDetail;
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
