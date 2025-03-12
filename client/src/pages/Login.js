import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LOGIN } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formState, setFormState] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  
  const [loginUser, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.token, data.login.user);
    },
    onError: (error) => {
      setError(error.message);
    },
  });
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    try {
      await loginUser({
        variables: { ...formState },
      });
    } catch (e) {
      // Error is handled in onError callback
    }
  };
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Log In
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        autoFocus
        value={formState.username}
        onChange={handleChange}
        disabled={loading}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        id="password"
        autoComplete="current-password"
        value={formState.password}
        onChange={handleChange}
        disabled={loading}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Log In'}
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          Don't have an account?{' '}
          <MuiLink component={Link} to="/register" variant="body2">
            Register here
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
