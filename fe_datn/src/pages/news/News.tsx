import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { newsData } from "./newsData";
import { Link } from "react-router-dom";

const News = () => {
  return (
    <Box sx={{ backgroundColor: "#f5f5f5", py: 5 }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          mb={4}
          textAlign="center"
        >
          Tin tức công nghệ
        </Typography>

        <Grid container spacing={4}>
          {/* Main News */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {newsData.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card
                    sx={{
                      display: "flex",
                      height: 200,
                      transition: "0.3s",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={item.image}
                      alt={item.title}
                      sx={{ width: 260 }}
                    />

                    <CardContent sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        gutterBottom
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={1}
                      >
                        {item.date}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Button
                        component={Link}
                        to={`/news/${item.id}`}
                        sx={{ mt: 2 }}
                        variant="contained"
                        color="warning"
                      >
                        Xem chi tiết
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
                p: 3,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" fontWeight={600} mb={2}>
                Tin mới nhất
              </Typography>

              <Stack spacing={2}>
                {newsData.map((item) => (
                  <Box
                    key={item.id}
                    component={Link}
                    to={`/news/${item.id}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover": { color: "#ff9800" },
                    }}
                  >
                    <Typography fontSize={14} fontWeight={500}>
                      {item.title}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default News;
