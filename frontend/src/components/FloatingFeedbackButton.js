import React, { useState } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import FeedbackIcon from '@mui/icons-material/Feedback';
import axios from 'axios';

const FloatingFeedbackButton = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/api/feedback', form);
      setSnackbarOpen(true);
      setOpen(false);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Give Feedback" arrow>
        <Fab
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 999,
            color: 'white',
            backgroundColor: theme.palette.warning.main,
            '&:hover': {
              backgroundColor: theme.palette.warning.dark,
            },
          }}
        >
          <FeedbackIcon />
        </Fab>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            background: 'linear-gradient(to right, #fffde7, #fff9c4)',
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'warning.dark' }}>
          We’d love your feedback 💬
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Your Name"
              name="name"
              fullWidth
              variant="outlined"
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              label="Your Email"
              name="email"
              fullWidth
              type="email"
              variant="outlined"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Your Message"
              name="message"
              fullWidth
              multiline
              minRows={4}
              variant="outlined"
              value={form.message}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            color="warning"
          >
            {loading ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
  open={snackbarOpen}
  autoHideDuration={4000}
  onClose={() => setSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    onClose={() => setSnackbarOpen(false)}
    severity="success"
    sx={{ fontWeight: 'bold', fontSize: '1.1rem',width: '100%' }}
  >
    🎉 Thanks for your feedback! We really appreciate it.
  </Alert>
</Snackbar>

    </>
  );
};

export default FloatingFeedbackButton;
