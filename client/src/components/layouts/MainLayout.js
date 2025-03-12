import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CabinIcon from '@mui/icons-material/Cabin';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationMenu from '../notifications/NotificationMenu';

const drawerWidth = 240;

const MainLayout = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  const { user, logout, isGlobalAdmin } = useAuth();
  const { mode, toggleColorMode } = useAppTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleOpenNotifications = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    setNotificationMenuOpen(true);
  };
  
  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
    setNotificationMenuOpen(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Cabins', icon: <CabinIcon />, path: '/cabins' },
    { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  ];
  
  // Add admin menu item if user is global admin
  if (user && isGlobalAdmin()) {
    menuItems.push({ text: 'Admin', icon: <AdminPanelSettingsIcon />, path: '/admin' });
  }
  
  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: 2,
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Typography variant="h6" noWrap component="div">
          FamilyCabin.io
        </Typography>
        <IconButton 
          color="inherit" 
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' } }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={isMobile ? handleDrawerToggle : undefined}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggleColorMode}>
          <ListItemIcon>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              FamilyCabin.io
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOpenNotifications}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <NotificationMenu 
                anchorEl={notificationAnchorEl}
                open={notificationMenuOpen}
                onClose={handleCloseNotifications}
              />
              
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                  <Avatar alt={user?.name} src="/images/avatars/default.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem component={Link} to="/profile" onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseUserMenu(); toggleColorMode(); }}>
                  <Typography textAlign="center">
                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleCloseUserMenu(); handleLogout(); }}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            bgcolor: 'background.paper',
          },
          display: { xs: drawerOpen ? 'block' : 'none', sm: 'block' }
        }}
      >
        {drawer}
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
