import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import CabinLogo from '../common/CabinLogo';

const AuthLayout = () => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  return (
    <Box 
      className="auth-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Container 
        component="main" 
        maxWidth="xs" 
        className="auth-content"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <CabinLogo size={isMobile ? 80 : 120} color="white" />
          <Typography 
            component="h1" 
            variant="h3" 
            sx={{ 
              mt: 2, 
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
            }}
          >
            FamilyCabin.io
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 1, 
              color: 'white',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
            }}
          >
            Connect with your shared cabin space
          </Typography>
        </Box>
        
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 3,
            backgroundColor: mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Outlet />
        </Paper>
        
        <Typography 
          variant="body2" 
          color="white" 
          align="center" 
          sx={{ 
            mt: 4,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          }}
        >
          &copy; {new Date().getFullYear()} FamilyCabin.io. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default AuthLayout;
