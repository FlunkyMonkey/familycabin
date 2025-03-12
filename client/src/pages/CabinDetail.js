import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
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
  Chip,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Menu
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { GET_CABIN } from '../graphql/queries';
import { 
  UPDATE_CABIN, 
  DELETE_CABIN, 
  APPROVE_MEMBERSHIP_REQUEST, 
  REJECT_MEMBERSHIP_REQUEST,
  REMOVE_CABIN_MEMBER,
  CHANGE_MEMBER_ROLE
} from '../graphql/mutations';
import { useAuth } from '../context/AuthContext';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cabin-tabpanel-${index}`}
      aria-labelledby={`cabin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CabinDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdminOfCabin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    location: '',
    image: '',
  });
  const [memberMenuAnchorEl, setMemberMenuAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  
  // Fetch cabin data
  const { data, loading, error } = useQuery(GET_CABIN, {
    variables: { cabinId: id },
    onCompleted: (data) => {
      setFormState({
        name: data.cabin.name,
        description: data.cabin.description,
        location: data.cabin.location,
        image: data.cabin.image || '',
      });
    },
  });
  
  // Mutations
  const [updateCabin, { loading: updateLoading }] = useMutation(UPDATE_CABIN);
  const [deleteCabin, { loading: deleteLoading }] = useMutation(DELETE_CABIN);
  const [approveMembershipRequest] = useMutation(APPROVE_MEMBERSHIP_REQUEST, {
    refetchQueries: ['GetCabin'],
  });
  const [rejectMembershipRequest] = useMutation(REJECT_MEMBERSHIP_REQUEST, {
    refetchQueries: ['GetCabin'],
  });
  const [removeCabinMember] = useMutation(REMOVE_CABIN_MEMBER, {
    refetchQueries: ['GetCabin'],
  });
  const [changeMemberRole] = useMutation(CHANGE_MEMBER_ROLE, {
    refetchQueries: ['GetCabin'],
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle form input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  
  // Open edit dialog
  const handleOpenEditDialog = () => {
    setEditDialogOpen(true);
  };
  
  // Close edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };
  
  // Submit edit form
  const handleEditSubmit = async () => {
    try {
      await updateCabin({
        variables: {
          cabinId: id,
          ...formState,
        },
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating cabin:', error);
    }
  };
  
  // Open delete dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  
  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  
  // Delete cabin
  const handleDeleteCabin = async () => {
    try {
      await deleteCabin({
        variables: { cabinId: id },
      });
      navigate('/cabins');
    } catch (error) {
      console.error('Error deleting cabin:', error);
    }
  };
  
  // Approve membership request
  const handleApproveMembership = async (userId) => {
    try {
      await approveMembershipRequest({
        variables: { cabinId: id, userId },
      });
    } catch (error) {
      console.error('Error approving membership:', error);
    }
  };
  
  // Reject membership request
  const handleRejectMembership = async (userId) => {
    try {
      await rejectMembershipRequest({
        variables: { cabinId: id, userId },
      });
    } catch (error) {
      console.error('Error rejecting membership:', error);
    }
  };
  
  // Open member menu
  const handleOpenMemberMenu = (event, member) => {
    setMemberMenuAnchorEl(event.currentTarget);
    setSelectedMember(member);
  };
  
  // Close member menu
  const handleCloseMemberMenu = () => {
    setMemberMenuAnchorEl(null);
    setSelectedMember(null);
  };
  
  // Remove member
  const handleRemoveMember = async () => {
    try {
      await removeCabinMember({
        variables: { cabinId: id, userId: selectedMember.userId },
      });
      handleCloseMemberMenu();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };
  
  // Change member role
  const handleChangeMemberRole = async (role) => {
    try {
      await changeMemberRole({
        variables: { cabinId: id, userId: selectedMember.userId, role },
      });
      handleCloseMemberMenu();
    } catch (error) {
      console.error('Error changing member role:', error);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error" variant="h6">
          Error loading cabin details. Please try again later.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/cabins')}
          sx={{ mt: 2 }}
        >
          Return to Cabin Directory
        </Button>
      </Box>
    );
  }
  
  const cabin = data?.cabin;
  const isAdmin = isAdminOfCabin(id);
  const pendingRequests = cabin?.membershipRequests?.filter(req => req.status === 'PENDING') || [];
  
  return (
    <Box>
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(to right, rgba(93, 64, 55, 0.05), rgba(46, 125, 50, 0.05))'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {cabin.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
              <Typography variant="body1" color="text.secondary">
                {cabin.location}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Created {new Date(cabin.createdAt).toLocaleDateString()} by {cabin.createdBy.name}
            </Typography>
          </Box>
          
          {isAdmin && (
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<EditIcon />}
                onClick={handleOpenEditDialog}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button 
                variant="outlined" 
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteDialog}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="cabin tabs">
            <Tab label="Details" />
            <Tab label="Members" />
            {isAdmin && pendingRequests.length > 0 && (
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Requests
                    <Chip 
                      label={pendingRequests.length} 
                      color="primary" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Box>
                } 
              />
            )}
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                About this Cabin
              </Typography>
              <Typography variant="body1" paragraph>
                {cabin.description}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Cabin Stats
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Members
                    </Typography>
                    <Typography variant="h6">
                      {cabin.members.length}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Admins
                    </Typography>
                    <Typography variant="h6">
                      {cabin.members.filter(m => m.role === 'ADMIN').length}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending Requests
                    </Typography>
                    <Typography variant="h6">
                      {pendingRequests.length}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Members ({cabin.members.length})
          </Typography>
          <List>
            {cabin.members.map((member) => (
              <ListItem key={member.userId} divider>
                <ListItemAvatar>
                  <Avatar alt={member.user.name} src="/images/avatars/default.jpg" />
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {member.user.name}
                      {member.role === 'ADMIN' && (
                        <Chip 
                          label="Admin" 
                          color="primary" 
                          size="small" 
                          icon={<AdminPanelSettingsIcon />}
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                  }
                  secondary={`@${member.user.username} • Joined ${new Date(member.joinedAt).toLocaleDateString()}`}
                />
                {isAdmin && member.userId !== user?._id && (
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      aria-label="member options"
                      onClick={(e) => handleOpenMemberMenu(e, member)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </TabPanel>
        
        {isAdmin && (
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Pending Membership Requests ({pendingRequests.length})
            </Typography>
            {pendingRequests.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No pending requests.
              </Typography>
            ) : (
              <List>
                {pendingRequests.map((request) => (
                  <ListItem key={request.userId} divider>
                    <ListItemAvatar>
                      <Avatar alt={request.user.name} src="/images/avatars/default.jpg" />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={request.user.name}
                      secondary={`@${request.user.username} • Requested ${new Date(request.requestDate).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="approve request"
                        color="success"
                        onClick={() => handleApproveMembership(request.userId)}
                        sx={{ mr: 1 }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="reject request"
                        color="error"
                        onClick={() => handleRejectMembership(request.userId)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </TabPanel>
        )}
      </Paper>
      
      {/* Edit Cabin Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Cabin</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Cabin Name"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Location"
            name="location"
            value={formState.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formState.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Image URL"
            name="image"
            value={formState.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained"
            disabled={updateLoading}
          >
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Cabin Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Cabin</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{cabin.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteCabin} 
            color="error"
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Member Options Menu */}
      <Menu
        anchorEl={memberMenuAnchorEl}
        open={Boolean(memberMenuAnchorEl)}
        onClose={handleCloseMemberMenu}
      >
        {selectedMember?.role === 'ADMIN' ? (
          <MenuItem onClick={() => handleChangeMemberRole('MEMBER')}>
            <ListItemIcon>
              <PersonRemoveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Remove Admin Role</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleChangeMemberRole('ADMIN')}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Make Admin</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleRemoveMember}>
          <ListItemIcon>
            <PersonRemoveIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Remove from Cabin</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default CabinDetail;
