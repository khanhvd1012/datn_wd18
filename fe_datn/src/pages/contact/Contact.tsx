import React, { useState } from "react";
import { createContactApi } from "../../services/contactService";

import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Paper,
  Stack,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";

const Contact = () => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await createContactApi(form);

      setOpen(true);

      setForm({
        username: "",
        email: "",
        phone: "",
        address: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box
      sx={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          minHeight: 340,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,.72),rgba(15,23,42,.72)),url(https://images.unsplash.com/photo-1521790797524-b2497295b8a0)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          textAlign: "center",
        }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              color: "#fff",
              fontSize: { xs: 36, md: 56 },
              mb: 2,
              letterSpacing: "-1px",
            }}
          >
            Liên hệ với chúng tôi
          </Typography>

          <Typography
            sx={{
              color: "rgba(255,255,255,.85)",
              fontSize: 17,
            }}
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc
          </Typography>
        </Box>
      </Box>

      {/* CONTACT INFO */}
      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -8 } }}>
        <Grid container spacing={3}>
          {[
            {
              icon: <LocationOnIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
              title: "Địa chỉ",
              text: "13 Trịnh Văn Bô, Hà Nội",
            },
            {
              icon: <PhoneIcon sx={{ fontSize: 40, color: "#10b981" }} />,
              title: "Hotline",
              text: "0987 654 321",
            },
            {
              icon: <EmailIcon sx={{ fontSize: 40, color: "#f97316" }} />,
              title: "Email",
              text: "support@shop.com",
            },
          ].map((item, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: "24px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  transition: ".3s",
                  height: "100%",
                  boxShadow: "0 10px 30px rgba(15,23,42,.04)",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 40px rgba(15,23,42,.08)",
                  },
                }}
              >
                <Box mb={2}>{item.icon}</Box>

                <Typography
                  fontWeight={700}
                  fontSize={20}
                  color="#0f172a"
                  mb={1}
                >
                  {item.title}
                </Typography>

                <Typography color="#64748b">{item.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FORM + MAP */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4} alignItems="stretch">
          {/* FORM */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "28px",
                border: "1px solid #e2e8f0",
                height: "100%",
                boxShadow: "0 10px 40px rgba(15,23,42,.04)",
              }}
            >
              <Typography
                variant="h4"
                fontWeight={800}
                color="#0f172a"
                mb={4}
              >
                Gửi tin nhắn
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <TextField
                    label="Họ và tên"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Số điện thoại"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Địa chỉ"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    fullWidth
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnIcon sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Nội dung"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={5}
                    fullWidth
                    sx={textFieldStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{ alignSelf: "flex-start", mt: 1.5 }}
                        >
                          <MessageIcon sx={{ color: "#94a3b8" }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      height: 56,
                      borderRadius: "16px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: 16,
                      background:
                        "linear-gradient(135deg,#2563eb,#3b82f6)",
                      boxShadow: "0 10px 25px rgba(37,99,235,.25)",

                      "&:hover": {
                        background:
                          "linear-gradient(135deg,#1d4ed8,#2563eb)",
                      },
                    }}
                  >
                    Gửi liên hệ
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Grid>

          {/* MAP */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "28px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                height: { xs: 400, md: "100%" },
                minHeight: 500,
                boxShadow: "0 10px 40px rgba(15,23,42,.04)",
              }}
            >
              <iframe
                title="map"
                src="https://maps.google.com/maps?q=13%20Tr%E1%BB%8Bnh%20V%C4%83n%20B%C3%B4%20H%C3%A0%20N%E1%BB%99i&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{
                  border: 0,
                }}
                loading="lazy"
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* ALERT */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 3,
            fontWeight: 600,
          }}
        >
          Gửi liên hệ thành công
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;

// ================= STYLE =================
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    background: "#fff",

    "& fieldset": {
      borderColor: "#e2e8f0",
    },

    "&:hover fieldset": {
      borderColor: "#94a3b8",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
      borderWidth: "2px",
    },
  },
};