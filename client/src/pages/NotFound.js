import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CabinIcon from '@mui/icons-material/Cabin';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundImage: 'url(/images/backgrounds/forest-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }}
      />
      
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 3,
          textAlign: 'center',
          maxWidth: 500,
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <CabinIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>
        
        <Typography variant="h5" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Return Home
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;
