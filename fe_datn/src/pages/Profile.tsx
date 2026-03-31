import { useEffect, useState } from "react";
import { getMeAPI, updateMeAPI, changePasswordAPI } from "../services/authService";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Divider,
  Stack,
  Container,
  Grid,
  TextField,
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Person,
  Lock,
  CameraAlt,
  Email,
  Phone,
  LocationOn,
  Visibility,
  VisibilityOff,
  Event,
  AdminPanelSettings,
  Shield,
  History,
} from "@mui/icons-material";

interface User {
  _id: string;
  email: string;
  username: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    username: "",
    fullName: "",
    phone: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getMeAPI();
      setUser(data.user);
      setProfileForm({
        username: data.user.username || "",
        fullName: data.user.fullName || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });
    } catch (err) {
      console.error("Lỗi lấy profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateMeAPI(profileForm);
      const updatedUser = res.user;
      
      // Giữ lại token cũ (login lưu token trong user object)
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      const mergedUser = { ...updatedUser, token: existingUser.token };
      localStorage.setItem("user", JSON.stringify(mergedUser));
      
      setNotification({
        open: true,
        message: "Cập nhật thông tin cá nhân thành công!",
        severity: "success",
      });
      setUser(updatedUser);
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message?.[0] || "Cập nhật thất bại",
        severity: "error",
      });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        open: true,
        message: "Mật khẩu xác nhận không khớp",
        severity: "error",
      });
      return;
    }
    try {
      await changePasswordAPI(passwordForm);
      setNotification({
        open: true,
        message: "Đổi mật khẩu thành công!",
        severity: "success",
      });
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Đổi mật khẩu thất bại",
        severity: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );

  if (!user)
    return (
      <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
        <Typography variant="h5">Không tìm thấy thông tin người dùng</Typography>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Thử lại</Button>
      </Container>
    );

  const premiumFont = { fontFamily: "'Inter', sans-serif" };

  return (
    <Box sx={{ bgcolor: "#f4f5f7", minHeight: "100vh", pb: 10 }}>
      {/* Banner */}
      <Box
        sx={{
          height: 200,
          background: "linear-gradient(135deg, #d70018 0%, #ff4b2b 60%, #c9000e 100%)",
          position: "relative",
        }}
      />

      {/* Profile Identity Bar */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #f0f0f0", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-end" },
              gap: 3,
              pt: { xs: 0, sm: 0 },
              pb: 3,
              mt: { xs: "-50px", sm: "-60px" },
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Avatar
                src={user.avatar}
                sx={{
                  width: { xs: 100, sm: 130 },
                  height: { xs: 100, sm: 130 },
                  border: "4px solid #fff",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  bgcolor: "#d70018",
                  fontSize: { xs: 38, sm: 48 },
                  fontWeight: "bold",
                }}
              >
                {user.username[0].toUpperCase()}
              </Avatar>
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  bgcolor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  "&:hover": { bgcolor: "#fafafa" },
                  width: 28,
                  height: 28,
                }}
              >
                <CameraAlt sx={{ fontSize: 15, color: "#d70018" }} />
              </IconButton>
            </Box>

            {/* Name + Role */}
            <Box sx={{ pb: 1, textAlign: { xs: "center", sm: "left" } }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }} flexWrap="wrap">
                <Typography variant="h5" fontWeight="800" color="#1a1a1a">
                  {user.fullName || user.username}
                </Typography>
                <Chip
                  size="small"
                  icon={user.role === "admin" ? <AdminPanelSettings sx={{ fontSize: "0.85rem !important", color: "#d70018 !important" }} /> : <Person sx={{ fontSize: "0.85rem !important" }} />}
                  label={user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                  sx={{
                    bgcolor: user.role === "admin" ? "rgba(215,0,24,0.08)" : "#f0f0f0",
                    color: user.role === "admin" ? "#d70018" : "#555",
                    fontWeight: "bold",
                    border: user.role === "admin" ? "1px solid rgba(215,0,24,0.2)" : "1px solid #ddd",
                    fontSize: "0.7rem",
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Flex Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>

          {/* Sidebar — 33% width on desktop */}
          <Box sx={{ width: { xs: '100%', md: '33%' }, flexShrink: 0 }}>
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3} display="flex" alignItems="center" gap={1}>
                    <Shield sx={{ color: '#d70018' }} /> Thông tin tài khoản
                  </Typography>
                  <Stack spacing={2.5}>
                    <Box display="flex" gap={2} alignItems="center">
                      <Email color="action" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Email</Typography>
                        <Typography variant="body2" fontWeight="600">{user.email}</Typography>
                      </Box>
                    </Box>
                    <Box display="flex" gap={2} alignItems="center">
                      <Event color="action" fontSize="small" />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Ngày tham gia</Typography>
                        <Typography variant="body2" fontWeight="600">
                          {new Date(user.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: 'long', year: 'numeric' })}
                        </Typography>
                      </Box>
                    </Box>
                    {user.phone && (
                      <Box display="flex" gap={2} alignItems="center">
                        <Phone color="action" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Số điện thoại</Typography>
                          <Typography variant="body2" fontWeight="600">{user.phone}</Typography>
                        </Box>
                      </Box>
                    )}
                    {user.address && (
                      <Box display="flex" gap={2} alignItems="center">
                        <LocationOn color="action" fontSize="small" />
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">Địa chỉ</Typography>
                          <Typography variant="body2" fontWeight="600">{user.address}</Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                  <Divider sx={{ my: 3 }} />
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<History />}
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 2,
                      fontWeight: "bold",
                      borderColor: '#d70018',
                      color: '#d70018',
                      '&:hover': { bgcolor: 'rgba(215,0,24,0.05)', borderColor: '#b30014' }
                    }}
                  >
                    Đăng xuất
                  </Button>
                </CardContent>
              </Card>

              {user.role === "admin" && (
                <Card sx={{
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #d70018 0%, #ff4b2b 100%)',
                  color: "#fff",
                  boxShadow: '0 8px 25px rgba(215,0,24,0.3)'
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" mb={1}>Quyền quản trị</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      Bạn đang sở hữu quyền quản trị cao nhất trên hệ thống Mobitech.
                    </Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ bgcolor: "#fff", color: "#d70018", fontWeight: "bold", '&:hover': { bgcolor: "#ffecec" } }}
                      onClick={() => window.location.href = "/admin"}
                    >
                      Đi tới Dashboard
                    </Button>
                  </CardContent>
                </Card>
              )}
            </Stack>
          </Box>

          {/* Main Content — grows to fill remaining space */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper sx={{ borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  sx={{
                    '& .MuiTabs-indicator': { bgcolor: '#d70018', height: 3 },
                    '& .MuiTab-root.Mui-selected': { color: '#d70018', fontWeight: 'bold' },
                  }}
                >
                  <Tab label="Thông tin cá nhân" icon={<Person />} iconPosition="start" sx={{ py: 2, fontWeight: "bold" }} />
                  <Tab label="Bảo mật & Mật khẩu" icon={<Lock />} iconPosition="start" sx={{ py: 2, fontWeight: "bold" }} />
                </Tabs>
              </Box>

              <Box sx={{ p: 4 }}>
                {activeTab === 0 && (
                  <form onSubmit={handleProfileUpdate}>
                    <Typography variant="h6" fontWeight="bold" mb={3}>Cập nhật thông tin</Typography>
                    {/* 2-col form grid via flexbox */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Tên đăng nhập"
                          value={profileForm.username}
                          onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                          required
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          InputProps={{ startAdornment: <InputAdornment position="start"><Phone fontSize="small" /></InputAdornment> }}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Địa chỉ Email"
                          value={user.email}
                          disabled
                          InputProps={{ startAdornment: <InputAdornment position="start"><Email fontSize="small" /></InputAdornment> }}
                        />
                      </Box>
                      <Box sx={{ flex: '1 1 100%', minWidth: 0 }}>
                        <TextField
                          fullWidth
                          label="Địa chỉ"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                          multiline
                          rows={2}
                          InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn fontSize="small" /></InputAdornment> }}
                        />
                      </Box>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 4, px: 6, borderRadius: 2, fontWeight: "bold",
                        background: 'linear-gradient(90deg, #d70018 0%, #ff4b2b 100%)',
                        boxShadow: '0 6px 20px rgba(215,0,24,0.3)',
                        '&:hover': { background: 'linear-gradient(90deg, #b30014 0%, #e03a20 100%)' }
                      }}
                    >
                      Lưu thay đổi
                    </Button>
                  </form>
                )}

                {activeTab === 1 && (
                  <form onSubmit={handleChangePassword}>
                    <Typography variant="h6" fontWeight="bold" mb={1}>Đổi mật khẩu</Typography>
                    <Typography variant="body2" color="text.secondary" mb={4}>
                      Bạn nên sử dụng mật khẩu mạnh để bảo vệ tài khoản tốt hơn.
                    </Typography>
                    <Stack spacing={3} maxWidth={500}>
                      <TextField
                        fullWidth
                        label="Mật khẩu hiện tại"
                        type={showOldPass ? "text" : "password"}
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowOldPass(!showOldPass)} edge="end">
                                {showOldPass ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Mật khẩu mới"
                        type={showNewPass ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowNewPass(!showNewPass)} edge="end">
                                {showNewPass ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Xác nhận mật khẩu mới"
                        type={showConfirmPass ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPass(!showConfirmPass)} edge="end">
                                {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Stack>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      sx={{
                        mt: 4, px: 6, borderRadius: 2, fontWeight: "bold",
                        background: 'linear-gradient(90deg, #1a1a1a 0%, #333 100%)',
                        '&:hover': { background: 'linear-gradient(90deg, #333 0%, #555 100%)' }
                      }}
                    >
                      Cập nhật mật khẩu
                    </Button>
                  </form>
                )}
              </Box>
            </Paper>
          </Box>

        </Box>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: "bold" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}