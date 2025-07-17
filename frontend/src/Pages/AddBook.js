import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import bookService from '../services/bookService';
import BookForm from '../components/BookForm';

const AddBook = ({ isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(isEdit); // only load when editing
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (isEdit && id) {
        try {
          const data = await bookService.getBook(id);
          setInitialData(data);
        } catch (error) {
          console.error('Error fetching book:', error);
          alert('❌ Could not load book data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBook();
  }, [id, isEdit]);

  const handleSubmit = async (formData) => {
    try {
      if (isEdit) {
        await bookService.updateBook(id, formData);
      } else {
        await bookService.addBook(formData);
      }
      setSnackbarOpen(true);

      setTimeout(() => {
        setSnackbarOpen(false);
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('❌ Submission failed. Please try again.');
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
    <>
      <Container sx={{ mt: 5, mb: 5 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          {isEdit ? '✏️ Edit Book' : '📚 Add New Book'}
        </Typography>

        <BookForm onSubmit={handleSubmit} initialData={initialData} />
      </Container>

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
          {isEdit ? '✅ Book updated successfully!' : '✅ Book added successfully!'}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddBook;
