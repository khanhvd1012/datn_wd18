import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const PurchaseGuide = () => {
  return (
    <Box sx={{ bgcolor: '#f6f8fb', py: 8, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
            Hướng Dẫn Mua Hàng Online
          </Typography>
          
          <Typography variant="body1" paragraph>
            Để mua hàng, quý khách có thể thực hiện theo các bước đơn giản sau đây:
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            Bước 1: Tìm kiếm sản phẩm
          </Typography>
          <Typography variant="body1" paragraph>
            Sử dụng thanh tìm kiếm hoặc duyệt qua các danh mục sản phẩm trên website để chọn mặt hàng cần mua. Click vào sản phẩm để xem thông tin chi tiết.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            Bước 2: Thêm vào giỏ hàng
          </Typography>
          <Typography variant="body1" paragraph>
            Sau khi chọn được màu sắc, kích thước và số lượng phù hợp, ấn nút "Thêm vào giỏ hàng" hoặc "Mua ngay".
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            Bước 3: Thanh toán
          </Typography>
          <Typography variant="body1" paragraph>
            Điền đầy đủ thông tin giao hàng gồm Tên, Số điện thoại và Địa chỉ. Lựa chọn phương thức thanh toán thuận tiện nhất và nhấn "Xác nhận đặt hàng". Đơn hàng sẽ được xử lý và giao đến tận nơi cho quý khách!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PurchaseGuide;
