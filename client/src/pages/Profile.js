import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Avatar,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { Visibility, VisibilityOff, Save } from '@mui/icons-material';

import { UPDATE_USER } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    bio: user?.bio || '',
    password: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Update user mutation
  const [updateUserMutation, { loading, error }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      updateUser(data.updateUser);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear password fields
      setFormState({
        ...formState,
        password: '',
        confirmPassword: '',
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    },
  });
  
  // Handle form input change
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
  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    
    // Validate form
    if (formState.password && formState.password !== formState.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (formState.password && formState.password.length < 5) {
      setPasswordError('Password must be at least 5 characters long');
      return;
    }
    
    try {
      const { confirmPassword, ...updateData } = formState;
      
      // Only include password if it's provided
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await updateUserMutation({
        variables: updateData,
      });
    } catch (e) {
      // Error is handled in onError callback
    }
  };
  
  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update your personal information and account settings.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                alt={user?.name} 
                src="/images/avatars/default.jpg"
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                @{user?.username}
              </Typography>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Member since:</strong> {new Date(user?.memberSince).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Role:</strong> {user?.role === 'GLOBAL_ADMIN' ? 'Global Admin' : 'Member'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cabins:</strong> {user?.cabins?.length || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: 'linear-gradient(to right, rgba(93, 64, 55, 0.05), rgba(46, 125, 50, 0.05))'
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Edit Profile
            </Typography>
            
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.message}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Address"
                    name="address"
                    value={formState.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formState.bio}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Tell us a bit about yourself..."
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary">
                      Change Password (optional)
                    </Typography>
                  </Divider>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="password"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
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
                    fullWidth
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formState.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    error={!!passwordError}
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
