import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import CabinIcon from '@mui/icons-material/Cabin';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { GET_USERS, GET_CABINS } from '../graphql/queries';
import { useAuth } from '../context/AuthContext';

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
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

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Fetch all users
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS);
  
  // Fetch all cabins
  const { data: cabinsData, loading: cabinsLoading, error: cabinsError } = useQuery(GET_CABINS);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'GLOBAL_ADMIN':
        return 'Global Admin';
      case 'ADMIN':
        return 'Admin';
      case 'MEMBER':
        return 'Member';
      default:
        return role;
    }
  };
  
  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'GLOBAL_ADMIN':
        return 'error';
      case 'ADMIN':
        return 'primary';
      case 'MEMBER':
        return 'default';
      default:
        return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage users, cabins, and system settings.
        </Typography>
      </Box>
      
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Users
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CabinIcon sx={{ mr: 1 }} />
                  Cabins
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                  System
                </Box>
              } 
            />
          </Tabs>
        </Box>
        
        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : usersError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              Error loading users: {usersError.message}
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Username</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersData?.users
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={getRoleDisplay(user.role)} 
                              color={getRoleColor(user.role)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={usersData?.users.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </TabPanel>
        
        {/* Cabins Tab */}
        <TabPanel value={tabValue} index={1}>
          {cabinsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : cabinsError ? (
            <Alert severity="error" sx={{ m: 2 }}>
              Error loading cabins: {cabinsError.message}
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Members</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cabinsData?.cabins
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((cabin) => (
                        <TableRow key={cabin._id}>
                          <TableCell>{cabin.name}</TableCell>
                          <TableCell>{cabin.location}</TableCell>
                          <TableCell>{cabin.members.length}</TableCell>
                          <TableCell>{formatDate(cabin.createdAt)}</TableCell>
                          <TableCell>
                            <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={cabinsData?.cabins.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </TabPanel>
        
        {/* System Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  System Information
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Version:</strong> 1.0.0
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Environment:</strong> Production
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Server:</strong> Ubuntu 22.04
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Database:</strong> MongoDB
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total Users:</strong> {usersData?.users.length || 0}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total Cabins:</strong> {cabinsData?.cabins.length || 0}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  System Actions
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    sx={{ mb: 2 }}
                  >
                    Backup Database
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="secondary" 
                    fullWidth 
                    sx={{ mb: 2 }}
                  >
                    Clear Cache
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth
                  >
                    Restart Server
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
