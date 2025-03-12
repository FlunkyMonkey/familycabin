import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  CardActions,
  Divider,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { GET_CABINS } from '../graphql/queries';
import { REQUEST_CABIN_MEMBERSHIP } from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

const CabinDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, isMemberOfCabin } = useAuth();
  
  // Fetch all cabins
  const { data, loading, error } = useQuery(GET_CABINS);
  
  // Request membership mutation
  const [requestMembership, { loading: requestLoading }] = useMutation(REQUEST_CABIN_MEMBERSHIP, {
    refetchQueries: ['GetCabins'],
  });
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Navigate to cabin creation page
  const handleCreateCabin = () => {
    navigate('/cabins/create');
  };
  
  // Navigate to cabin detail page
  const handleViewCabin = (cabinId) => {
    navigate(`/cabins/${cabinId}`);
  };
  
  // Request to join a cabin
  const handleRequestMembership = async (cabinId, event) => {
    event.stopPropagation();
    try {
      await requestMembership({
        variables: { cabinId },
      });
    } catch (error) {
      console.error('Error requesting membership:', error);
    }
  };
  
  // Filter cabins based on search term
  const filteredCabins = data?.cabins.filter(cabin => 
    cabin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cabin.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cabin Directory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse all available cabins or create your own.
        </Typography>
      </Box>
      
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, rgba(93, 64, 55, 0.05), rgba(46, 125, 50, 0.05))'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Search cabins..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={handleCreateCabin}
            sx={{ ml: 2 }}
          >
            Create Cabin
          </Button>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center">
            Error loading cabins. Please try again later.
          </Typography>
        ) : filteredCabins.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            No cabins found matching your search.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredCabins.map((cabin) => {
              const isMember = isMemberOfCabin(cabin._id);
              const hasPendingRequest = cabin.membershipRequests?.some(
                request => request.userId === user?._id && request.status === 'PENDING'
              );
              
              return (
                <Grid item xs={12} sm={6} md={4} key={cabin._id}>
                  <Card 
                    className="cabin-card"
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleViewCabin(cabin._id)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={cabin.image || '/images/cabins/default-cabin.jpg'}
                      alt={cabin.name}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {cabin.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {cabin.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <GroupIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {cabin.members.length} {cabin.members.length === 1 ? 'member' : 'members'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {cabin.description?.substring(0, 100)}
                        {cabin.description?.length > 100 ? '...' : ''}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions>
                      {isMember ? (
                        <Chip 
                          label="Member" 
                          color="primary" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                      ) : hasPendingRequest ? (
                        <Chip 
                          label="Request Pending" 
                          color="secondary" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                      ) : (
                        <Tooltip title="Request to join">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={(e) => handleRequestMembership(cabin._id, e)}
                            disabled={requestLoading}
                          >
                            <PersonAddIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Box sx={{ flexGrow: 1 }} />
                      <Button 
                        size="small" 
                        endIcon={<ArrowForwardIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewCabin(cabin._id);
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default CabinDirectory;
