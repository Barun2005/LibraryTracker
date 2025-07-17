import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  Grid,
  Paper,
  Stack,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import { PersonAddAlt1 } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const fd = new FormData();
    fd.append('username', formData.username);
    fd.append('email', formData.email);
    fd.append('password', formData.password);
    if (profilePicture) fd.append('profilePicture', profilePicture);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      localStorage.setItem('token', res.data.token);
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
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
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 480, width: '100%',background: 'linear-gradient(to right, #fffde7, #fff9c4)', }}>
        <Stack alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'warning.main' }}>
            <PersonAddAlt1 />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            Create Your Account
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Grid item>
              <Avatar
                src={preview}
                alt="Preview"
                sx={{ width: 56, height: 56, bgcolor: 'warning.main' }}
              >
                {!preview && formData.username.charAt(0).toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Button variant="outlined" component="label" fullWidth color="warning">
                Upload Profile Picture
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="warning"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Register & Go to Dashboard
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </form>
      </Paper>

      {/* ✅ Snackbar Confirmation */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}
        >
          🎉 Registration successful! Redirecting to dashboard...
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
