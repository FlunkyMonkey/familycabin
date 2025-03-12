import React from 'react';
import PropTypes from 'prop-types';
import { 
  Menu, 
  MenuItem, 
  Typography, 
  Box, 
  Divider, 
  Button,
  IconButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AnnouncementIcon from '@mui/icons-material/Announcement';

import { useNotifications } from '../../context/NotificationContext';

const NotificationMenu = ({ anchorEl, open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  
  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    
    // Navigate based on notification type
    if (notification.relatedTo) {
      navigate(`/cabins/${notification.relatedTo}`);
    }
    
    onClose();
  };
  
  const handleMarkAllRead = () => {
    markAllAsRead();
    onClose();
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'INVITE':
        return <PersonAddIcon fontSize="small" color="primary" />;
      case 'APPROVAL':
        return <HomeIcon fontSize="small" color="success" />;
      case 'SYSTEM':
        return <AnnouncementIcon fontSize="small" color="info" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };
  
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          maxHeight: 400,
          width: 360,
          overflow: 'auto',
          mt: 1.5,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <IconButton size="small" onClick={handleMarkAllRead} title="Mark all as read">
          <DoneAllIcon fontSize="small" />
        </IconButton>
      </Box>
      
      <Divider />
      
      {notifications.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <NotificationsIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No notifications yet
          </Typography>
        </Box>
      ) : (
        <>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification._id} 
              onClick={() => handleNotificationClick(notification)}
              className="notification-item"
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                borderLeft: notification.read ? 'none' : '4px solid',
                borderColor: 'primary.main',
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText 
                primary={notification.message}
                secondary={new Date(notification.createdAt).toLocaleString()}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: notification.read ? 'normal' : 'bold',
                }}
                secondaryTypographyProps={{
                  variant: 'caption',
                }}
              />
            </MenuItem>
          ))}
          
          <Divider />
          
          <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              size="small"
              onClick={handleMarkAllRead}
              startIcon={<DoneAllIcon />}
            >
              Mark all as read
            </Button>
          </Box>
        </>
      )}
    </Menu>
  );
};

NotificationMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationMenu;
