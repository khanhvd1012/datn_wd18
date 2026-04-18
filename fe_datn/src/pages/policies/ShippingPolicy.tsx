import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const ShippingPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#f6f8fb', py: 8, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
            Chính Sách Giao Hàng
          </Typography>
          
          <Typography variant="body1" paragraph>
            Cửa hàng hiện đang phục vụ giao hàng trên toàn quốc với các đơn vị vận chuyển uy tín nhằm mang lại trải nghiệm mua sắm nhanh chóng nhất.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            1. Phạm vi giao hàng
          </Typography>
          <Typography variant="body1" paragraph>
            – Hỗ trợ giao hàng trên tất cả 63 tỉnh thành Việt Nam. Đối với các đơn hàng gửi đi quốc tế, vui lòng liên hệ trước với Hotline.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            2. Thời gian giao hàng dự kiến
          </Typography>
          <Typography variant="body1" paragraph>
            – Nội thành Hà Nội/TP.HCM: Từ 1-2 ngày làm việc. <br/>
            – Các tỉnh thành khác: Từ 3-5 ngày làm việc tùy vào khoảng cách. <br/>
            – Trong một số trường hợp khách quan (như thời tiết xấu, lễ, Tết), thời gian có thể chậm trễ thêm 1-2 ngày.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            3. Phí vận chuyển
          </Typography>
          <Typography variant="body1" paragraph>
            Cửa hàng áp dụng phí ship linh hoạt tùy theo giá trị đơn hàng và khoảng cách địa lý. Đơn hàng từ 500,000 VND trở lên sẽ được miễn phí vận chuyển (Freeship) trên toàn quốc.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShippingPolicy;
