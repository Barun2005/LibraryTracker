import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const AUTH_URL = `${API_URL}/api/auth`;
const OTP_URL = `${API_URL}/api/otp`;


const login = async (credentials) => {
  const { data } = await axios.post(`${AUTH_URL}/login`, credentials);
  localStorage.setItem('token', data.token);
  window.location.href = '/';
  return data;
};

const register = async (userInfo) => {
  const { data } = await axios.post(`${AUTH_URL}/register`, userInfo, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  localStorage.setItem('token', data.token);
  return data;
};

const logout = () => {
  localStorage.removeItem('token');
};

const getToken = () => localStorage.getItem('token');

const getCurrentUser = async () => {
  const token = getToken();
  if (!token) throw new Error('No token found');
  const { data } = await axios.get(`${AUTH_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

const updateProfile = async (formData) => {
  const token = getToken();
  const { data } = await axios.put(`${AUTH_URL}/me`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const requestOtp = async (email) => {
  const { data } = await axios.post(`${OTP_URL}/request-otp`, { email });
  return data;
};

const verifyOtp = async (email, code) => {
  try {
    console.log('Verifying OTP:', { email, code: String(code).trim() });

    const { data } = await axios.post(`${OTP_URL}/verify-otp`, {
      email,
      code: String(code).trim(),
    });

    console.log('OTP verification response:', data);

    // Save token from backend
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (err) {
    console.error('OTP verification error:', err.response?.data);
    throw new Error(err.response?.data?.message || 'OTP verification failed');
  }
};

export default {
  login,
  register,
  logout,
  getToken,
  getCurrentUser,
  updateProfile,
  requestOtp,
  verifyOtp,
};
