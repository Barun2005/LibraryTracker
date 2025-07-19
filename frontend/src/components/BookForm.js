import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
  Paper
} from '@mui/material';

const BookForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'To Read',
    coverImage: null,
    file: null,
    existingCoverImage: '',
    existingFile: ''
  });

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (initialData && initialData._id) {
      setFormData((prev) => ({
        ...prev,
        title: initialData.title || '',
        author: initialData.author || '',
        genre: initialData.genre || '',
        status: initialData.status || 'To Read',
        existingCoverImage: initialData.coverImage || '',
        existingFile: initialData.file || ''
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mt: 3,
        borderRadius: 3,
        bgcolor: '#fffde7',
        maxWidth: 700,
        mx: 'auto'
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Genre"
          name="genre"
          value={formData.genre}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="To Read">To Read</MenuItem>
            <MenuItem value="Reading">Reading</MenuItem>
            <MenuItem value="Read">Read</MenuItem>
          </Select>
        </FormControl>

        {/* Upload PDF & Thumbnail in one row */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                name="file"
                onChange={handleFileChange}
              />
            </Button>
            {formData.file ? (
              <Typography variant="body2" mt={1}>
                {formData.file.name}
              </Typography>
            ) : formData.existingFile ? (
              <Typography variant="body2" mt={1}>
                {formData.existingFile.split('/').pop()}
              </Typography>
            ) : null}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Thumbnail
              <input
                type="file"
                accept="image/*"
                hidden
                name="coverImage"
                onChange={handleFileChange}
              />
            </Button>
            {formData.coverImage ? (
              <Box mt={1}>
                <img
                  src={URL.createObjectURL(formData.coverImage)}
                  alt="Thumbnail"
                  style={{ width: '100px', borderRadius: '4px' }}
                />
              </Box>
            ) : formData.existingCoverImage ? (
              <Box mt={1}>
                <img
                  src={`${API_URL}/${formData.existingCoverImage}`}
                  alt="Existing thumbnail"
                  style={{ width: '100px', borderRadius: '4px' }}
                />
              </Box>
            ) : null}
          </Grid>
        </Grid>

        {/* Centered Submit Button */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              px: 4,
              bgcolor: '#f9a825',
              '&:hover': { bgcolor: '#ec9913ff' }
            }}
          >
            {initialData && initialData._id ? 'Update Book' : 'Add Book'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BookForm;
