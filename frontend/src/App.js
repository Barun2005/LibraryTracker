import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import FloatingFeedbackButton from './components/FloatingFeedbackButton';

import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import AddBook from './Pages/AddBook';
import BookDetails from './Pages/BookDetails';
import Profile from './Pages/Profile';

const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            background: 'linear-gradient(to right, #c9d6ff, #e2e2e2)',
          }}
        >
          <Header />

          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add-book"
                element={
                  <PrivateRoute>
                    <AddBook />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit-book/:id"
                element={
                  <PrivateRoute>
                    <AddBook isEdit={true} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/book/:id"
                element={
                  <PrivateRoute>
                    <BookDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Fallback Route */}
              <Route
                path="*"
                element={
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2>404 - Page Not Found</h2>
                  </div>
                }
              />
            </Routes>
          </div>

          <Footer />
          <FloatingFeedbackButton />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
