<<<<<<< HEAD
import { useEffect, useState } from "react";
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
    fetch("http://localhost:3000/api/news")
      .then((res) => res.json())
      .then((data) => setNews(data))
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
=======
import React from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box
} from "@mui/material";

import { Link } from "react-router-dom";

/* DATA */

const news = [
  {
    id: 1,
    title: "iPhone 16 sắp ra mắt",
    img: "https://picsum.photos/900/500?1",
    date: "12/03/2026",
    desc: "Apple chuẩn bị ra mắt iPhone thế hệ mới với nhiều nâng cấp AI và camera."
  },
  {
    id: 2,
    title: "Samsung Galaxy S mới",
    img: "https://picsum.photos/600/350?2",
    date: "10/03/2026",
    desc: "Samsung giới thiệu dòng Galaxy mới với màn hình AMOLED."
  },
  {
    id: 3,
    title: "Laptop AI 2026",
    img: "https://picsum.photos/600/350?3",
    date: "08/03/2026",
    desc: "Laptop tích hợp AI đang trở thành xu hướng công nghệ."
  },
  {
    id: 4,
    title: "Xu hướng điện thoại gập",
    img: "https://picsum.photos/600/350?4",
    date: "05/03/2026",
    desc: "Điện thoại màn hình gập đang trở thành xu hướng mới."
  }
];

const News = () => {

  return (

<Box>

{/* HERO */}

<Box
sx={{
height:300,
backgroundImage:`
linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.4)),
url("https://images.unsplash.com/photo-1518779578993-ec3579fee39f")
`,
backgroundSize:"cover",
backgroundPosition:"center",
display:"flex",
alignItems:"center",
justifyContent:"center",
color:"white"
}}
>

<Typography variant="h3" fontWeight="bold">
Tin tức công nghệ
</Typography>

</Box>


<Container sx={{py:6}}>

{/* FEATURED NEWS */}

<Card
component={Link}
to={`/news/${news[0].id}`}
sx={{
mb:6,
borderRadius:3,
overflow:"hidden",
textDecoration:"none"
}}
>

<CardMedia
component="img"
height="420"
image={news[0].img}
/>

<CardContent>

<Typography color="text.secondary" fontSize={14}>
{news[0].date}
</Typography>

<Typography variant="h4" fontWeight="bold" mt={1}>
{news[0].title}
</Typography>

<Typography mt={1} mb={2}>
{news[0].desc}
</Typography>

<Button
variant="contained"
sx={{
background:"#ff6a00",
":hover":{background:"#e65100"}
}}
>

Đọc tiếp

</Button>

</CardContent>

</Card>


{/* NEWS GRID */}

<Grid container spacing={4}>

{news.slice(1).map((item)=>(

<Grid item xs={12} md={4} key={item.id}>

<Card
component={Link}
to={`/news/${item.id}`}
sx={{
borderRadius:3,
overflow:"hidden",
textDecoration:"none",
transition:"0.3s",
cursor:"pointer",
"&:hover img":{
transform:"scale(1.1)"
},
"&:hover":{
boxShadow:8
}
}}
>

<Box sx={{overflow:"hidden"}}>

<CardMedia
component="img"
height="220"
image={item.img}
sx={{transition:"0.4s"}}
/>

</Box>

<CardContent>

<Typography fontSize={13} color="text.secondary">
{item.date}
</Typography>

<Typography fontWeight="bold" mt={1} mb={1}>
{item.title}
</Typography>

<Typography variant="body2" color="text.secondary">
{item.desc}
</Typography>

</CardContent>

</Card>

</Grid>

))}

</Grid>

</Container>

</Box>

  );
};

export default News;
>>>>>>> eadc387cb669490d5a9694d97cda59cd5982f6fa
