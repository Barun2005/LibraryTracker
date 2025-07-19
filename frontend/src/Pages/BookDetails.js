import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Chip,
  Paper,
  Stack,
  CircularProgress
} from '@mui/material';
import bookService from '../services/bookService';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const books = await bookService.getBooks();
        const foundBook = books.find(b => b._id === id);
        if (foundBook) {
          setBook(foundBook);
        } else {
          navigate('/');
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await bookService.deleteBook(id);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 18 }}>
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  if (!book) return <Typography sx={{ mt: 5 }}>Book not found</Typography>;

  return (
    <Container sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        {/* Title and Actions */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="primary">
            {book.title}
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => navigate(`/edit-book/${book._id}`)}
              sx={{ mr: 2 }}
            >
              ✏️ Edit
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              🗑️ Delete
            </Button>
          </Box>
        </Box>

        {/* Side-by-side layout */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'flex-start',
          }}
        >
          {/* Book Cover */}
          {book.coverImage && (
            <Box sx={{ flex: '1', textAlign: 'center' }}>
              <img
                src={`${process.env.REACT_APP_API_URL}/${book.coverImage}`}
                alt={book.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: 8,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                }}
              />
            </Box>
          )}

          {/* Book Details */}
          <Stack spacing={2} flex="2">
            <Typography variant="h6">
              <strong>Author:</strong> {book.author}
            </Typography>

            <Typography variant="body1">
              <strong>Genre:</strong> {book.genre}
            </Typography>

            <Typography variant="body1">
              <strong>Status:</strong>{' '}
              <Chip
                label={book.status}
                color={
                  book.status === 'To Read'
                    ? 'default'
                    : book.status === 'Reading'
                    ? 'primary'
                    : 'success'
                }
                variant="outlined"
              />
            </Typography>

            <Typography variant="body1">
              <strong>Added on:</strong>{' '}
              {new Date(book.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default BookDetails;
