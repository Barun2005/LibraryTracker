// ✅ Polished Header with Enhanced Profile Hover Box
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Paper,
  Stack,
  Fade,
  Divider,
} from '@mui/material';
import authService from '../services/authService';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authService.getCurrentUser();
        setUser(res);
      } catch (err) {
        console.error('Failed to load user:', err);
      }
    };

    fetchUser();

    const interval = setInterval(() => {
      if (localStorage.getItem('profile_updated')) {
        fetchUser();
        localStorage.removeItem('profile_updated');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const renderAvatar = () => {
    if (user?.profilePicture) {
      return (
        <Avatar
          alt={user.username}
          src={`http://localhost:5000/${user.profilePicture}`}
          sx={{ width: 36, height: 36, cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        />
      );
    }
    return (
      <Avatar
        sx={{ bgcolor: 'primary.main', width: 36, height: 36, cursor: 'pointer' }}
        onClick={() => navigate('/profile')}
      >
        {user?.username?.charAt(0).toUpperCase() || '?'}
      </Avatar>
    );
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ background: 'linear-gradient(to right, #1e3c72, #2a5298)' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          component={Link}
          to="/"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          📚 Personal Library Tracker
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative' }}>
          <Button color="inherit" component={Link} to="/">Dashboard</Button>
          <Button color="inherit" component={Link} to="/add-book">Add Book</Button>

          {user && (
            <Box
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              sx={{ position: 'relative' }}
            >
              <IconButton size="small">{renderAvatar()}</IconButton>

              <Fade in={hover} timeout={200}>
                <Paper
                  elevation={6}
                  sx={{
                    position: 'absolute',
                    top: 48,
                    right: 0,
                    bgcolor: '#f0f4ff',
                    color: 'text.primary',
                    width: 260,
                    borderRadius: 2,
                    p: 2,
                    zIndex: 1300,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => navigate('/profile')}
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                    >
                      Edit Profile
                    </Button>
                  </Stack>
                </Paper>
              </Fade>
            </Box>
          )}

          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
