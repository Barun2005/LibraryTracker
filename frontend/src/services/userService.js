import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/user`;

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`
});

const getProfile = async () => {
  const { data } = await axios.get(`${API_URL}/profile`, {
    headers: authHeaders()
  });
  return data;
};

const updateProfile = async (formData) => {
  const { data } = await axios.put(`${API_URL}/profile`, formData, {
    headers: authHeaders()
  });
  return data;
};

export default {
  getProfile,
  updateProfile
};
