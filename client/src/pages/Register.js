import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { REGISTER } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    address: '',
    bio: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();
  
  const [registerUser, { loading }] = useMutation(REGISTER, {
    onCompleted: (data) => {
      login(data.register.token, data.register.user);
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
    
    // Check password match when either password field changes
    if (name === 'password' || name === 'confirmPassword') {
      if (name === 'password' && formState.confirmPassword && value !== formState.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else if (name === 'confirmPassword' && value !== formState.password) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    // Validate form
    if (formState.password !== formState.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (formState.password.length < 5) {
      setPasswordError('Password must be at least 5 characters long');
      return;
    }
    
    try {
      const { confirmPassword, ...registerData } = formState;
      await registerUser({
        variables: registerData,
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
        Create Account
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            value={formState.username}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            value={formState.password}
            onChange={handleChange}
            disabled={loading}
            error={!!passwordError}
            helperText={passwordError}
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
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            autoComplete="new-password"
            value={formState.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            error={!!passwordError}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            value={formState.name}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            value={formState.address}
            onChange={handleChange}
            disabled={loading}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            id="bio"
            label="Bio"
            name="bio"
            multiline
            rows={3}
            value={formState.bio}
            onChange={handleChange}
            disabled={loading}
            placeholder="Tell us a bit about yourself..."
          />
        </Grid>
      </Grid>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2, py: 1.5 }}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Register'}
      </Button>
      
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          Already have an account?{' '}
          <MuiLink component={Link} to="/login" variant="body2">
            Log in here
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
