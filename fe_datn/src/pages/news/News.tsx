import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { newsData } from "./newsData";
import { Link } from "react-router-dom";

const News = () => {
  return (
    <Box sx={{ backgroundColor: "#f3f4f6", py: 6 }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Typography
          variant="h4"
          fontWeight={700}
          mb={5}
          textAlign="center"
        >
          Tin tức công nghệ
        </Typography>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {newsData.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      boxShadow: 2,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    {/* Ảnh */}
                    <Box sx={{ overflow: "hidden" }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "100%",
                          height: 300,
                          objectFit: "cover",
                          transition: "0.4s",
                        }}
                      />
                    </Box>

                    {/* Nội dung */}
                    <CardContent>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        gutterBottom
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.date}
                      </Typography>

                      <Typography
                        variant="body1"
                        mt={2}
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Button
                        component={Link}
                        to={`/news/${item.id}`}
                        variant="contained"
                        color="warning"
                        sx={{
                          mt: 3,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
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
                borderRadius: 3,
                p: 3,
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
              >
                Tin mới nhất
              </Typography>

              <Stack spacing={3}>
                {newsData.map((item) => (
                  <Box
                    key={item.id}
                    component={Link}
                    to={`/news/${item.id}`}
                    sx={{
                      display: "flex",
                      gap: 2,
                      textDecoration: "none",
                      color: "inherit",
                      "&:hover .title": {
                        color: "#f59e0b",
                      },
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: 80,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />

                    <Box>
                      <Typography
                        className="title"
                        fontSize={14}
                        fontWeight={600}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.date}
                      </Typography>
                    </Box>
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
