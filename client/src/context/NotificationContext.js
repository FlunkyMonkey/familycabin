import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MY_NOTIFICATIONS } from '../graphql/queries';
import { MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ } from '../graphql/mutations';
import { useAuth } from './AuthContext';

// Create the notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  
  // Query to get user notifications
  const { data, loading, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
    skip: !user,
    fetchPolicy: 'network-only',
  });
  
  // Mutations for marking notifications as read
  const [markNotificationRead] = useMutation(MARK_NOTIFICATION_READ);
  const [markAllNotificationsRead] = useMutation(MARK_ALL_NOTIFICATIONS_READ);
  
  // Update notifications when data changes
  useEffect(() => {
    if (data && data.myNotifications) {
      setNotifications(data.myNotifications);
      setUnreadCount(data.myNotifications.filter(n => !n.read).length);
    }
  }, [data]);
  
  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      await markNotificationRead({
        variables: { notificationId },
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Refresh notifications
  const refreshNotifications = () => {
    if (user) {
      refetch();
    }
  };
  
  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
