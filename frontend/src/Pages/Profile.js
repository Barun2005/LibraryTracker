import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  CircularProgress,
  Avatar,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data);
        setUsername(data.username || '');
        if (data.profilePicture) {
          setPreview(`${process.env.REACT_APP_API_URL}/${data.profilePicture}`);

        }
      } catch (err) {
        console.error(err);
        alert('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('username', username);
    if (imageFile) {
      formData.append('profilePicture', imageFile);
    }

    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      if (updated.profilePicture) {
        setPreview(`${process.env.REACT_APP_API_URL}/${updated.profilePicture}`);

      }

      setSnackbarOpen(true); // ✅ Show success popup

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500); // ✅ Delay redirect
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 18 }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 128px)',
        background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)', // ✅ Yellowish gradient
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, maxWidth: 500, width: '100%', }}>
        <Stack spacing={3} alignItems="center">
          <Typography variant="h4" fontWeight="bold" color="warning.dark">
            Profile Dashboard
          </Typography>

          <Avatar
            src={preview}
            alt={username}
            sx={{ width: 100, height: 100, fontSize: 40, bgcolor: 'warning.main' }}
          >
            {!preview && username.charAt(0).toUpperCase()}
          </Avatar>

          <Button component="label" variant="outlined" size="small" color="warning">
            Upload Picture
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            value={user?.email || ''}
            disabled
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            color="warning"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>

      {/* ✅ Snackbar popup */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ fontWeight: 'bold', fontSize: '1.1rem', width: '100%' }}
        >
          ✅ Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
