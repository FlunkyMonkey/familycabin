import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Divider,
  Paper,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonIcon from '@mui/icons-material/Person';
import CabinIcon from '@mui/icons-material/Cabin';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { GET_ME, GET_MY_CABINS, GET_MY_NOTIFICATIONS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user's cabins
  const { data: cabinsData, loading: cabinsLoading } = useQuery(GET_MY_CABINS);
  
  // Fetch recent notifications
  const { data: notificationsData, loading: notificationsLoading } = useQuery(GET_MY_NOTIFICATIONS);
  
  // Navigate to cabin creation page
  const handleCreateCabin = () => {
    navigate('/cabins/create');
  };
  
  // Navigate to cabin detail page
  const handleViewCabin = (cabinId) => {
    navigate(`/cabins/${cabinId}`);
  };
  
  // Navigate to cabin directory
  const handleViewAllCabins = () => {
    navigate('/cabins');
  };
  
  // Get recent notifications (limit to 5)
  const recentNotifications = notificationsData?.myNotifications.slice(0, 5) || [];
  
  // Get user's cabins
  const userCabins = cabinsData?.myCabins || [];
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.name || 'Cabin Member'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your cabin dashboard provides quick access to your cabins and recent notifications.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* My Cabins Section */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 3, 
              mb: 4, 
              borderRadius: 2,
              background: 'linear-gradient(to right, rgba(93, 64, 55, 0.05), rgba(46, 125, 50, 0.05))'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
                <CabinIcon sx={{ mr: 1 }} /> My Cabins
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<AddIcon />}
                onClick={handleCreateCabin}
              >
                Create Cabin
              </Button>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {cabinsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : userCabins.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CabinIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  You haven't joined any cabins yet.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={handleViewAllCabins}
                  sx={{ mt: 2 }}
                >
                  Browse Cabins
                </Button>
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {userCabins.map((cabin) => (
                    <Grid item xs={12} sm={6} key={cabin._id}>
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
                          height="140"
                          image={cabin.image || '/images/cabins/default-cabin.jpg'}
                          alt={cabin.name}
                        />
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography gutterBottom variant="h6" component="div">
                            {cabin.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {cabin.location}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Chip 
                              size="small" 
                              label={cabin.members.find(m => m.userId === user?._id)?.role || 'MEMBER'} 
                              color={cabin.members.find(m => m.userId === user?._id)?.role === 'ADMIN' ? 'primary' : 'default'}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {cabin.members.length} {cabin.members.length === 1 ? 'member' : 'members'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                
                {userCabins.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button 
                      variant="text" 
                      endIcon={<ArrowForwardIcon />}
                      onClick={handleViewAllCabins}
                    >
                      View All Cabins
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
        
        {/* Notifications and Profile Section */}
        <Grid item xs={12} md={4}>
          {/* Profile Summary */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <PersonIcon sx={{ mr: 1 }} /> Profile Summary
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                alt={user?.name} 
                src="/images/avatars/default.jpg"
                sx={{ width: 64, height: 64, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">@{user?.username}</Typography>
              </Box>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Member since:</strong> {new Date(user?.memberSince).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Cabins:</strong> {user?.cabins?.length || 0}
              </Typography>
            </Box>
            
            <Button 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
              onClick={() => navigate('/profile')}
            >
              Edit Profile
            </Button>
          </Paper>
          
          {/* Recent Notifications */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" component="h3" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
              <NotificationsIcon sx={{ mr: 1 }} /> Recent Notifications
            </Typography>
            
            <Divider sx={{ mb: 2 }} />
            
            {notificationsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : recentNotifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <NotificationsIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No notifications yet
                </Typography>
              </Box>
            ) : (
              <List sx={{ width: '100%', p: 0 }}>
                {recentNotifications.map((notification) => (
                  <ListItem 
                    key={notification._id}
                    alignItems="flex-start"
                    sx={{ 
                      px: 0,
                      borderLeft: notification.read ? 'none' : '3px solid',
                      borderColor: 'primary.main',
                      pl: notification.read ? 0 : 1,
                      bgcolor: notification.read ? 'transparent' : 'action.hover',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: notification.read ? 'action.disabledBackground' : 'primary.main' }}>
                        <NotificationsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.message}
                      secondary={new Date(notification.createdAt).toLocaleString()}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: notification.read ? 'normal' : 'medium',
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            {recentNotifications.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button 
                  variant="text" 
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {}}
                >
                  View All Notifications
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
