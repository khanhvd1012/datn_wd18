import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const ReturnPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#f6f8fb', py: 8, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
            Bảo Hành & Đổi Trả
          </Typography>
          
          <Typography variant="body1" paragraph>
            Quy định chung về chính sách bảo hành, đổi trả sản phẩm của cửa hàng:
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            1. Điều kiện đổi trả
          </Typography>
          <Typography variant="body1" paragraph>
            – Sản phẩm mua không quá 7 ngày kể từ ngày nhận hàng. <br/>
            – Sản phẩm phải còn nguyên mác, tem bảo hành, chưa qua sử dụng, và không bị hư hỏng do tác động vật lý. <br/>
            – Có lỗi phát sinh từ phía nhà sản xuất hoặc giao sai quy cách hàng hóa.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            2. Quy trình bảo hành
          </Typography>
          <Typography variant="body1" paragraph>
            – Khách hàng có thể mang hàng đến trực tiếp cửa hàng hoặc gửi hàng qua đường bưu điện (vui lòng liên hệ Hotline trước khi gửi). <br/>
            – Thời gian xử lý bảo hành thường kéo dài từ 3 đến 7 ngày làm việc kể từ lúc chúng tôi nhận được sản phẩm cần bảo hành.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            3. Chi phí vận chuyển
          </Typography>
          <Typography variant="body1" paragraph>
            Trong trường hợp lỗi thuộc về NSX (sản phẩm bị hỏng kỹ thuật), cửa hàng sẽ chịu hoàn toàn phí ship thu hồi và đổi hàng mới. Trường hợp đổi trả theo yêu cầu của khách hàng, khách hàng vui lòng tự thanh toán phí vận chuyển.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ReturnPolicy;
