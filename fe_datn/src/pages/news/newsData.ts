export interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "iPhone 16 ra mắt – Có gì mới?",
    description:
      "Apple chính thức ra mắt iPhone 16 với nhiều cải tiến về camera và hiệu năng.",
    image:
      "https://cdn.tgdd.vn/Files/2024/09/10/1552273/iphone-16-hero.jpg",
    date: "12/09/2025",
  },
  {
    id: 2,
    title: "Top laptop sinh viên đáng mua 2025",
    description:
      "Danh sách laptop giá tốt, cấu hình mạnh dành cho sinh viên CNTT.",
    image:
      "https://cdn.tgdd.vn/Files/2024/08/20/1549982/laptop-sinh-vien.jpg",
    date: "05/09/2025",
  },
  {
    id: 3,
    title: "Khuyến mãi cuối năm – Giảm đến 50%",
    description:
      "Hàng loạt sản phẩm công nghệ giảm sâu, cơ hội mua sắm không thể bỏ lỡ.",
    image:
      "https://cdn.tgdd.vn/Files/2024/11/01/1562219/sale-cuoi-nam.jpg",
    date: "01/09/2025",
  },
];
