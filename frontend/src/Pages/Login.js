import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Paper,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');

  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authService.login(formData);
      const userData = await authService.getCurrentUser();
      setUser(userData);

      showSnackbar('✅ Login successful!', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials');
      showSnackbar('❌ Invalid email or password', 'error');
    }
  };

  const handleOtpSend = async () => {
    if (!otpEmail) return showSnackbar('Enter your email.', 'warning');
    try {
      await authService.requestOtp(otpEmail);
      setOtpSent(true);
      showSnackbar('📩 OTP sent to your email', 'success');
    } catch {
      showSnackbar('❌ Failed to send OTP', 'error');
    }
  };

  const handleOtpVerify = async () => {
  try {
    const { token, user } = await authService.verifyOtp(otpEmail, otpInput);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    showSnackbar('✅ Login successful!', 'success');
    setOtpDialogOpen(false);
    setOtpSent(false);
    setOtpEmail('');
    setOtpInput('');
    setTimeout(() => {
  navigate('/dashboard');
  window.location.reload(); // ✅ Forces full refresh to reload all user data
}, 1000);

  } catch (err) {
    console.error('OTP verification failed:', err);
    showSnackbar('❌ Invalid or expired OTP', 'error');
  }
};


  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)',
        p: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 3,
          maxWidth: 400,
          width: '100%',
          background: 'linear-gradient(to right, #fffde7, #fff9c4)',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: '#f57f17' }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" color="#f57f17">
            Login to Your Library
          </Typography>
        </Stack>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#f57f17',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#f9a825',
              },
            }}
          >
            Login
          </Button>

          <Typography align="center">
            <Link
              component="button"
              variant="body2"
              onClick={() => setOtpDialogOpen(true)}
              sx={{ color: '#f57f17', fontWeight: 'bold' }}
            >
              Forgot Password?
            </Link>
            
          </Typography>

          <Typography align="center" sx={{ mt: 1 }}>
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/register"
              sx={{ color: '#f57f17', fontWeight: 'bold' }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* OTP Dialog */}
      <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
        <DialogTitle>Forgot Password - OTP Login</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={otpEmail}
            onChange={(e) => setOtpEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
          {otpSent && (
            <TextField
              label="Enter OTP"
              fullWidth
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          {!otpSent ? (
            <Button onClick={handleOtpSend} variant="contained" color="primary">
              Send OTP
            </Button>
          ) : (
            <Button onClick={handleOtpVerify} variant="contained" color="success">
              Verify OTP
            </Button>
          )}
          <Button onClick={() => setOtpDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
