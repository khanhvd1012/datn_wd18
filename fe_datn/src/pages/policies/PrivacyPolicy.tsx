import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ bgcolor: '#f6f8fb', py: 8, minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
            Chính Sách Bảo Mật
          </Typography>
          
          <Typography variant="body1" paragraph>
            Chào mừng bạn đến với cửa hàng của chúng tôi. Việc bảo mật thông tin cá nhân của bạn là ưu tiên hàng đầu của chúng tôi. Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng một cách an toàn nhất.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            1. Mục đích thu thập thông tin
          </Typography>
          <Typography variant="body1" paragraph>
            Việc thu thập dữ liệu trên website bao gồm: email, điện thoại, mật khẩu đăng nhập, địa chỉ khách hàng. Đây là các thông tin mà chúng tôi cần thành viên cung cấp bắt buộc khi đăng ký sử dụng dịch vụ và để chúng tôi liên hệ xác nhận khi khách hàng đăng ký sử dụng dịch vụ trên website nhằm đảm bảo quyền lợi cho cho người tiêu dùng.
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            2. Phạm vi sử dụng thông tin
          </Typography>
          <Typography variant="body1" paragraph>
            Website sử dụng thông tin thành viên cung cấp để cung cấp các dịch vụ đến thành viên; Giao hàng theo địa chỉ mà thành viên cung cấp; Gửi email tiếp thị, khuyến mại về hàng hóa do chúng tôi bán.
          </Typography>

          <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
            3. Thời gian lưu trữ thông tin
          </Typography>
          <Typography variant="body1" paragraph>
            Dữ liệu cá nhân của thành viên sẽ được lưu trữ cho đến khi có yêu cầu hủy bỏ hoặc tự thành viên đăng nhập và thực hiện hủy bỏ. Còn lại trong mọi trường hợp thông tin cá nhân thành viên sẽ được bảo mật trên máy chủ của chúng tôi.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
