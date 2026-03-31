import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Container,
  Tabs,
  Tab,
  Divider,
  Grid,
  alpha,
  useTheme
} from "@mui/material";
import {
  LocalShippingOutlined,
  CheckCircleOutline,
  ScheduleOutlined,
  CancelOutlined,
  ShoppingBagOutlined,
  Inventory2Outlined
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getOrdersApi } from "../services/orderService";
import type { Order } from "../services/orderService";

// Helper function to get image URL properly
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "https://placehold.co/100x100?text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("uploads/")) {
    return `http://localhost:3000/${imagePath}`;
  }
  return `http://localhost:3000/uploads/products/${imagePath}`;
};

const Orders = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrdersApi();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "Chờ xác nhận", color: "warning", icon: <ScheduleOutlined fontSize="small" /> };
      case "confirmed":
        return { label: "Đã xác nhận", color: "success", icon: <CheckCircleOutline fontSize="small" /> };
      case "processing":
        return { label: "Đang xử lý", color: "info", icon: <Inventory2Outlined fontSize="small" /> };
      case "shipping":
        return { label: "Đang giao", color: "secondary", icon: <LocalShippingOutlined fontSize="small" /> };
      case "delivered":
        return { label: "Đã giao hàng", color: "success", icon: <CheckCircleOutline fontSize="small" /> };
      case "cancelled":
        return { label: "Đã hủy", color: "error", icon: <CancelOutlined fontSize="small" /> };
      default:
        return { label: status || "Không xác định", color: "default", icon: <ShoppingBagOutlined fontSize="small" /> };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (tabValue === "all") return true;
    return order.order_status === tabValue;
  });

  return (
    <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", pb: 10, textAlign: 'left' }}>
      {/* Premium Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        py: { xs: 5, md: 8 },
        mb: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography 
            variant="h4" 
            fontWeight={700} 
            sx={{ 
              mb: 2, 
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            Lịch sử mua hàng
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: alpha('#fff', 0.8), 
              maxWidth: 600,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
            }}
          >
            Kiểm tra trạng thái và theo dõi các đơn hàng bạn đã đặt một cách dễ dàng và nhanh chóng.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'white'
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
              "& .MuiTab-root": {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                minHeight: 56
              }
            }}
          >
            <Tab label="Tất cả đơn" value="all" />
            <Tab label="Chờ xác nhận" value="pending" />
            <Tab label="Đã xác nhận" value="confirmed" />
            <Tab label="Đang xử lý" value="processing" />
            <Tab label="Đang giao" value="shipping" />
            <Tab label="Hoàn thành" value="delivered" />
            <Tab label="Đã hủy" value="cancelled" />
          </Tabs>
        </Paper>

        <Box mt={4}>
          {loading ? (
            <Typography align="center" color="text.secondary" py={5}>
              Đang tải danh sách đơn hàng...
            </Typography>
          ) : filteredOrders.length === 0 ? (
            <Paper elevation={0} sx={{ p: 8, textAlign: 'center', borderRadius: 4, bgcolor: 'transparent', border: '1px dashed #cbd5e1' }}>
              <ShoppingBagOutlined sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={600}>
                Chưa có đơn hàng nào
              </Typography>
              <Typography variant="body2" color="text.disabled" mb={3}>
                Bạn chưa có đơn hàng nào trong trạng thái này.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')} disableElevation sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600 }}>
                Tiếp tục mua sắm
              </Button>
            </Paper>
          ) : (
            <Stack spacing={3}>
              {filteredOrders.map((order) => {
                const status = getStatusInfo(order.order_status);
                // Lấy sản phẩm đầu tiên để hiển thị thumbnail, hỗ trợ object (product_id) hoặc string (name)
                const firstItem = order.order_items[0];
                const productInfo = firstItem?.product_id || {};
                
                let itemName = firstItem?.name;
                if (!itemName && typeof productInfo === 'object') {
                  itemName = (productInfo as any).name;
                }
                
                let itemImage = firstItem?.image;
                if (!itemImage && typeof productInfo === 'object' && Array.isArray((productInfo as any).images)) {
                  itemImage = (productInfo as any).images[0];
                }

                return (
                  <Paper
                    key={order._id}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.2s ease",
                      "&:hover": { 
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        borderColor: alpha(theme.palette.primary.main, 0.3)
                      }
                    }}
                  >
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                      <Typography variant="body2" fontWeight={700} sx={{ color: 'text.secondary' }}>
                        Mã đơn: <Box component="span" sx={{ color: 'text.primary' }}>#{order._id.slice(-8).toUpperCase()}</Box>
                      </Typography>
                      <Chip
                        icon={status.icon}
                        label={status.label}
                        color={status.color as any}
                        size="small"
                        sx={{ fontWeight: 600, px: 0.5, letterSpacing: '0.3px' }}
                      />
                    </Box>

                    <Box sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ flexShrink: 0 }}>
                          <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: 2, 
                            border: '1px solid #f1f5f9',
                            overflow: 'hidden',
                            bgcolor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <img 
                              src={getImageUrl(itemImage)} 
                              alt={itemName || "Product"} 
                              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ flexGrow: 1, minWidth: 150 }}>
                          <Typography variant="subtitle1" fontWeight={600} noWrap>
                            {itemName || "Sản phẩm"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            {order.order_items.length > 1 ? `và ${order.order_items.length - 1} sản phẩm khác` : `Số lượng: ${firstItem?.quantity || 1}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mt={0.5}>
                            Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ flexShrink: 0, width: { xs: '100%', sm: 'auto' }, textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                          <Typography variant="body2" color="text.secondary" mb={0.5}>
                            Tổng tiền
                          </Typography>
                          <Typography variant="h6" fontWeight={700} color="primary.main">
                            {order.total?.toLocaleString('vi-VN')}₫
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2.5 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {order.order_status === "delivered" && (
                          <Button 
                            variant="outlined" 
                            color="inherit" 
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Đánh giá
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          disableElevation
                          onClick={() => navigate(`/orders/${order._id}`)}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            textTransform: "none",
                            fontWeight: 600,
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Orders;