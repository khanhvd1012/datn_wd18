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