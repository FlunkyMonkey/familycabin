import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import CabinIcon from '@mui/icons-material/Cabin';

import { CREATE_CABIN } from '../graphql/mutations';
import { GET_MY_CABINS } from '../graphql/queries';

const CreateCabin = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
  });
  const [error, setError] = useState('');
  
  // Create cabin mutation
  const [createCabin, { loading }] = useMutation(CREATE_CABIN, {
    onCompleted: (data) => {
      navigate(`/cabins/${data.createCabin._id}`);
    },
    onError: (error) => {
      setError(error.message);
    },
    refetchQueries: [{ query: GET_MY_CABINS }],
  });
  
  // Handle form input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    
    // Validate form
    if (!formState.name || !formState.description || !formState.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      await createCabin({
        variables: { ...formState },
      });
    } catch (e) {
      // Error is handled in onError callback
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Cabin
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Set up a new cabin space for your family or friends.
        </Typography>
      </Box>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          maxWidth: 800,
          mx: 'auto',
          background: 'linear-gradient(to right, rgba(93, 64, 55, 0.05), rgba(46, 125, 50, 0.05))'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CabinIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h5" component="h2">
            Cabin Details
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Cabin Name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. Mountain View Retreat"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Location"
                name="location"
                value={formState.location}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g. Lake Tahoe, California"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formState.description}
                onChange={handleChange}
                disabled={loading}
                placeholder="Describe your cabin, its surroundings, and any special features..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                name="image"
                value={formState.image}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/cabin-image.jpg"
                helperText="Optional: Provide a URL to an image of your cabin"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/cabins')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Creating...' : 'Create Cabin'}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          As the creator, you'll automatically be assigned as the cabin admin.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          You can invite others to join your cabin after creation.
        </Typography>
      </Box>
    </Box>
  );
};

export default CreateCabin;
