import React, { useEffect, useState } from "react";
import { getPaymentInfoApi } from "../services/paymentService";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Alert,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PaymentBank = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const data = await getPaymentInfoApi();
        if (data && data.bankInfo) {
          setBankInfo(data.bankInfo);
        }
      } catch (error) {
        console.error("Error fetching bank info:", error);
      }
    };

    fetchBankInfo();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!orderId) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Không tìm thấy thông tin đơn hàng</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 6, maxWidth: "800px" }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <CheckCircleIcon sx={{ fontSize: 60, color: "#4caf50", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Đơn hàng đã được tạo thành công
          </Typography>
          <Typography color="text.secondary">
            Vui lòng chuyển khoản theo thông tin bên dưới để hoàn tất thanh toán
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        {bankInfo && (
          <Card sx={{ mb: 4, border: "2px solid #1976d2" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3} color="primary">
                Thông tin chuyển khoản
              </Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography color="text.secondary" fontSize={14}>
                    Ngân hàng
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="bold" fontSize={18}>
                      {bankInfo.bankName}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(bankInfo.bankName)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>

                <Box>
                  <Typography color="text.secondary" fontSize={14}>
                    Số tài khoản
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="bold" fontSize={18} color="#d70018">
                      {bankInfo.accountNumber}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(bankInfo.accountNumber)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>

                <Box>
                  <Typography color="text.secondary" fontSize={14}>
                    Chủ tài khoản
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="bold" fontSize={18}>
                      {bankInfo.accountName}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(bankInfo.accountName)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>

                {bankInfo.branch && (
                  <Box>
                    <Typography color="text.secondary" fontSize={14}>
                      Chi nhánh
                    </Typography>
                    <Typography fontWeight="bold" fontSize={18}>
                      {bankInfo.branch}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography color="text.secondary" fontSize={14}>
                    Nội dung chuyển khoản
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight="bold" fontSize={18} color="#1976d2">
                      {bankInfo.content} {orderId.toString().slice(-6).toUpperCase()}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => copyToClipboard(`${bankInfo.content} ${orderId.toString().slice(-6).toUpperCase()}`)}
                      startIcon={<ContentCopyIcon />}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
              </Stack>

              {copied && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Đã copy vào clipboard!
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography fontWeight="bold" mb={1}>
            Lưu ý:
          </Typography>
          <Typography component="div">
            • Vui lòng chuyển khoản đúng số tiền và nội dung như trên
            <br />
            • Đơn hàng sẽ được xác nhận sau khi chúng tôi nhận được tiền (thường trong 1-2 giờ)
            <br />
            • Mã đơn hàng: <strong>{orderId.toString().slice(-6).toUpperCase()}</strong>
          </Typography>
        </Alert>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => navigate("/orders")}
          >
            Xem đơn hàng
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              background: "#d70018",
              "&:hover": { background: "#b71c1c" }
            }}
          >
            Tiếp tục mua sắm
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaymentBank;
