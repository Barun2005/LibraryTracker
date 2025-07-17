import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Avatar,
  Paper,
  CircularProgress,
} from '@mui/material';
import BookCard from '../components/BookCard';
import FilterBooks from '../components/FilterBooks';
import bookService from '../services/bookService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
 const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🧠 Try to get user from backend
        let userData = null;
        try {
          userData = await authService.getCurrentUser();
        } catch {
          // fallback if backend fails: use localStorage
          const stored = localStorage.getItem('user');
          if (stored) userData = JSON.parse(stored);
        }

        setUser(userData);

        const data = await bookService.getBooks(filters);
        setBooks(data);
      } catch (err) {
        console.error('❌ Failed to fetch user or books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const handleDelete = async (id) => {
    try {
      await bookService.deleteBook(id);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
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
        minHeight: '100vh',
        background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)',
        py: 5,
      }}
    >
      <Container>
        {user && (
          <Paper
            elevation={4}
            sx={{
              px: 4,
              py: 3,
              mb: 5,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              borderRadius: 3,
              backgroundColor: 'white',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                src={
                  user.profilePicture
                    ? `http://localhost:5000/${user.profilePicture}`
                    : ''
                }
                sx={{ width: 72, height: 72, fontSize: 32, bgcolor: 'primary.main' }}
              >
                {!user.profilePicture && user?.username?.[0]?.toUpperCase()}
              </Avatar>

              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Hello, {user?.username} 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Welcome to your personal library
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="h5"
              color="primary"
              fontWeight="bold"
              sx={{ mt: { xs: 2, sm: 0 } }}
            >
              You have{' '}
              <span style={{ color: '#3b546cff' }}>
                {books.length} {books.length === 1 ? 'book' : 'books'}
              </span>{' '}
              in your library.
            </Typography>
          </Paper>
        )}

        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          {user?.username}'s Library 📚
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <FilterBooks
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
          />
          <Button variant="contained" size="large" onClick={() => navigate('/add-book')}>
            ➕ Add Book
          </Button>
        </Box>

        <Grid container spacing={4}>
          {books.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary" fontStyle="italic">
                No books found. Try adding some!
              </Typography>
            </Grid>
          ) : (
            books.map((book) => (
              <Grid item key={book._id} xs={12} sm={6} md={4} lg={3}>
                <BookCard book={book} onDelete={handleDelete} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
