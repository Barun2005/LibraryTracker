import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Box, Button } from '@mui/material';

const FilterBooks = ({ filters, setFilters, onReset }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        label="Search by Title"
        name="title"
        value={filters.title || ''}
        onChange={handleChange}
        size="small"
      />
      <TextField
        label="Search by Author"
        name="author"
        value={filters.author || ''}
        onChange={handleChange}
        size="small"
      />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          name="status"
          value={filters.status || ''}
          onChange={handleChange}
          label="Status"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="To Read">To Read</MenuItem>
          <MenuItem value="Reading">Reading</MenuItem>
          <MenuItem value="Read">Read</MenuItem>
        </Select>
      </FormControl>
      <Button variant="outlined" onClick={onReset}>
        Reset
      </Button>
    </Box>
  );
};

export default FilterBooks;