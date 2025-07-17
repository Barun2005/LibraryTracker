// src/services/bookService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/books';

const getToken = () => localStorage.getItem('token');

/* ------------------------ HELPERS ------------------------ */

const authHeaders = () => {
  const token = getToken();
  if (!token) throw new Error('No auth token – please log in again.');
  return { Authorization: `Bearer ${token}` };
};

const appendFormData = (dataObj) => {
  const fd = new FormData();
  Object.entries(dataObj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      fd.append(key, value);
    }
  });
  return fd;
};

/* ------------------------ API CALLS ------------------------ */

const getBooks = async (filters = {}) => {
  const { data } = await axios.get(API_URL, {
    params: filters,
    headers: authHeaders(),
  });
  return data;
};

const getBook = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`, {
    headers: authHeaders(),
  });
  return data;
};

const addBook = async (bookData) => {
  const formData = appendFormData(bookData);
  const { data } = await axios.post(API_URL, formData, {
    headers: authHeaders(), // No need to set Content-Type manually
  });
  return data;
};

const updateBook = async (id, bookData) => {
  const formData = appendFormData(bookData);
  const { data } = await axios.put(`${API_URL}/${id}`, formData, {
    headers: authHeaders(),
  });
  return data;
};

const deleteBook = async (id) => {
  const { data } = await axios.delete(`${API_URL}/${id}`, {
    headers: authHeaders(),
  });
  return data;
};

const searchGoogleBooks = async (query) => {
  const { data } = await axios.get(`${API_URL}/search/${query}`, {
    headers: authHeaders(),
  });
  return data;
};

export default {
  getBooks,
  getBook,           // ✅ Added
  addBook,
  updateBook,
  deleteBook,
  searchGoogleBooks,
};
