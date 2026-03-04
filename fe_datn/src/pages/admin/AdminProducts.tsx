import { Typography } from '@mui/material';
import { Box } from 'lucide-react';
import React from 'react'

const AdminProducts = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Products
      </Typography>

      <Typography>
        Danh sách sản phẩm hiển thị tại đây.
      </Typography>
    </Box>
  );
}

export default AdminProducts