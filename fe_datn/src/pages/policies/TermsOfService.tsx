import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const TermsOfService = () => {
  return (
    <Box sx={{ bgcolor: '#f6f8fb', py: 8, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
            Điều Khoản Dịch Vụ
          </Typography>
          
          <Typography variant="body1" paragraph>
            Bằng việc truy cập hoặc mua sắm trên hệ thống của chúng tôi, quý khách đồng ý tuân thủ theo các điều khoản dịch vụ dưới đây.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            1. Quyền và Trách nhiệm của Khách hàng
          </Typography>
          <Typography variant="body1" paragraph>
            Cung cấp thông tin chính xác và đầy đủ trong quá trình mua hàng và thanh toán. Quý khách có trách nhiệm bảo mật thông tin tài khoản và không chia sẻ mật khẩu cho người khác.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            2. Quyền và Trách nhiệm của Cửa hàng
          </Typography>
          <Typography variant="body1" paragraph>
            Chúng tôi cam kết cung cấp sản phẩm đúng như hình ảnh và chất lượng đã công bố. Đảm bảo giao hàng đúng thời gian dự kiến và thực hiện các chính sách hỗ trợ sau bán hàng công bằng.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            3. Thay đổi Điều khoản
          </Typography>
          <Typography variant="body1" paragraph>
            Cửa hàng có quyền thay đổi các Điều khoản Dịch vụ này vào bất kỳ lúc nào mà không cần thông báo trước. Việc quý khách tiếp tục sử dụng website sau khi các thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận những sửa đổi đó.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;
