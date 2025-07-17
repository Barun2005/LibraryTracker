import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 'auto',
        py: 3,
        px: 2,
        background: 'linear-gradient(to right, #3f51b5, #5c6bc0)', // Indigo gradient
        textAlign: 'center',
        color: '#fff',
      }}
    >
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
        © {new Date().getFullYear()} All rights reserved.
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
        This project is created by{' '}
        <Link
          href="https://www.linkedin.com/in/yash-pratap-rai-00465a284/"
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ color: '#ffeb3b', fontWeight: 500 }}
        >
          Yash Pratap Rai
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
