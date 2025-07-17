import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, onDelete }) => {
  const navigate = useNavigate();

  const statusColors = {
    'To Read': 'default',
    'Reading': 'primary',
    'Read': 'success',
  };

  const viewURL = book.file ? `http://localhost:5000/${book.file}` : null;
  const downloadURL = book.file
    ? `http://localhost:5000/download/${book.file.replace(/^uploads[\\/]/, '')}`
    : null;

  return (
    <Card sx={{ maxWidth: 345, m: 2, borderRadius: 3, boxShadow: 4 }}>
      {book.coverImage && (
        <CardMedia
          component="img"
          height="180"
          image={`http://localhost:5000/${book.coverImage}`}
          alt={book.title}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {book.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Author:</strong> {book.author}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Genre:</strong> {book.genre}
        </Typography>

        <Chip
          label={book.status}
          color={statusColors[book.status]}
          size="small"
        />
      </CardContent>

      {viewURL && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <Box display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="outlined"
              color="primary"
              href={viewURL}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
            >
              View PDF
            </Button>
            <Button
              variant="contained"
              color="secondary"
              href={downloadURL}
              download
              size="small"
            >
              Download
            </Button>
          </Box>
        </Box>
      )}

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button size="small" onClick={() => navigate(`/book/${book._id}`)}>
          View Details
        </Button>
        <Button size="small" onClick={() => navigate(`/edit-book/${book._id}`)}>
          Edit
        </Button>
        <Button size="small" color="error" onClick={() => onDelete(book._id)}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookCard;
