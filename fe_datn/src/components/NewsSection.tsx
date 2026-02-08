import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";

const newsData = [
  {
    id: 1,
    title: "Top phụ kiện iPhone bán chạy nhất 2024",
    image: "/news/news1.jpg",
    desc: "Danh sách phụ kiện được người dùng lựa chọn nhiều nhất..."
  },
  {
    id: 2,
    title: "Có nên dùng sạc nhanh cho điện thoại?",
    image: "/news/news2.jpg",
    desc: "Giải đáp thắc mắc về công nghệ sạc nhanh hiện nay..."
  },
  {
    id: 3,
    title: "Cách bảo vệ pin điện thoại bền hơn",
    image: "/news/news3.jpg",
    desc: "Những mẹo đơn giản giúp pin điện thoại dùng lâu hơn..."
  }
];

const NewsSection = () => {
  return (
    <Box sx={{ backgroundColor: "#111", p: 1.2, mt: 3 }}>
      {/* Header giống phụ kiện */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <Box
          sx={{
            backgroundColor: "#ff6a00",
            color: "#fff",
            px: 4.8,
            py: 1,
            fontWeight: "bold",
            clipPath:
              "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)",
          }}
        >
          TIN TỨC
        </Box>
      </Box>

      <Grid container spacing={1}>
        {newsData.map((item) => (
          <Grid item xs={12} md={4} key={item.id}>
            <Card
              component={Link}
              to="/news"
              sx={{
                textDecoration: "none",
                backgroundColor: "#1a1a1a",
                border: "1px solid #2a2a2a",
                height: 360,
                transition: ".4s",
                "&:hover": {
                  borderColor: "#ff6a00",
                  transform: "translateY(-5px)"
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={item.image}
                alt={item.title}
              />
              <CardContent>
                <Typography color="#fff" fontWeight={600} mb={1}>
                  {item.title}
                </Typography>
                <Typography fontSize={14} color="#aaa">
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default NewsSection;
